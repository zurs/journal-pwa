import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {PatientModel} from '../models/patient.model';
import {Observable} from 'rxjs/Observable';
import {JournalModel} from '../models/journal.model';

PouchDB.plugin(PouchDBFind);

@Injectable()
export class LocalDbService {
  private patientsDb: PouchDB;
  private journalsDb: PouchDB;
  private remoteCouchServer = 'http://admin:admin@127.0.0.1:5984/';
  private SERVER_URL = 'http://127.0.0.1:80/stack1';
  private replicationActive = false;

  constructor(private http: HttpClient,
              private accService: AccountService) {
    this.patientsDb = new PouchDB('patients');
    this.journalsDb = new PouchDB('journals');
    // this.patientsDb.sync(this.remoteCouchServer + 'rep_test', {live: true});
    // Start replication

  }

  public syncPatient(id: string): Observable<any> {
    // syncDom.setAttribute('data-sync-state', 'syncing');

    const returnObservable = new Observable<any>(observer => {
      const url = this.SERVER_URL + '/patient/' + id + '/store';
      this.http.post<any>(url, {
        apiKey: this.accService.getApiKey()
      })
        .subscribe(response => {
          console.log(this.replicationActive);
          if (!this.replicationActive) {
            const remotePatientsDb = this.remoteCouchServer + response.db + '_patients';
            const remoteJournalsDb = this.remoteCouchServer + response.db + '_journals';
            // Replicate patients
            this.setupReplication(this.patientsDb, remotePatientsDb, ['_id']).subscribe(newData => {
              observer.next(newData);
            });
            // ==================
            // Replicate journals
            this.setupReplication(this.journalsDb, remoteJournalsDb, ['_id', 'patientId']).subscribe(newData => {
              console.log('New journals added');
            });
            this.replicationActive = true;
          }
        });
    });

    return returnObservable;
  }

  public unsyncPatient(id: string) {
    this.http.delete(this.SERVER_URL + '/patient/' + id + '/store?apiKey=' + this.accService.getApiKey()).subscribe(response => {
      console.log('Patient is or is about to get unsynced');
    });
  }

  public getPatients(): Observable<PatientModel[]> {
    return new Observable<PatientModel[]>(observer => {
      this.patientsDb.allDocs({include_docs: true})
        .then(data => {
          let returnArray = [];
          console.log('Local patints db: ');
          console.log(data);
          if (data.total_rows === 0) {
            returnArray = [];
          } else {
            returnArray = [];
            data.rows.forEach((patient) => {
              if (patient.id.substr(0, 7) !== '_design') {
                const newPatient = new PatientModel(patient.doc._id, patient.doc.name, patient.doc.ssn);
                newPatient.localyStored = true;
                returnArray.push(newPatient);
              }
            });
          }
          observer.next(returnArray);
        });
    });
  }

  public getPatient(id: string): Observable<PatientModel> {
    return new Observable<PatientModel>(observer => {
      this.patientsDb.find({
        selector: {
          _id: id
        }
      }).then((result) => {
        console.log(result);
        if (typeof result.docs[0] !== 'undefined') {
          observer.next(PatientModel.parsePouchObject(result.docs[0]));
        } else {
          observer.next(null);
        }
      });
    });
  }

  public getPatientJournals(patientId: string): Observable<JournalModel[]> {
    return new Observable<JournalModel[]>(observer => {
      console.log(patientId);
      this.journalsDb.find({
        selector: {
          patientId: patientId
        },
        fields: ['_id', 'submittedAt']
      })
        .then(result => {
          console.log(result);
          observer.next(JournalModel.parseArray(result.docs));
          observer.complete();
        });
    });
  }

  public getPatientJournal(id: string): Observable<JournalModel> {
    return new Observable<JournalModel>(observer => {
      this.journalsDb.find({
        selector: {
          '_id': id
        }
      })
        .then(result => {
          console.log(result);
          observer.next(JournalModel.parseObject(result.docs[0]));
          observer.complete();
        });
    });
  }

  private setupReplication(localDb: PouchDB, remoteAddress: string, indexFields: string[]): Observable<any> {
    return new Observable<any>(observer => {
      localDb.replicate.from(remoteAddress).on('complete', function (info) {
        console.log('Full replication done from: ' + remoteAddress);
        localDb.createIndex({
          index: {fields: indexFields}
        });
        observer.next(info);
        localDb.sync(remoteAddress, {live: true, retry: true})
          .on('error', (errorMsg) => {
            console.log('Syncing error: ', errorMsg);
          })
          .on('change', newData => {
            console.log('database changed.');
            observer.next(newData);
          });
      });
    });
  }
}

