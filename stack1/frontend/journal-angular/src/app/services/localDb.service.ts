import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {PatientModel} from '../models/patient.model';
import {Observable} from 'rxjs/Observable';
import {JournalModel} from '../models/journal.model';
import {Subject} from 'rxjs/Subject';

PouchDB.plugin(PouchDBFind);

@Injectable()
export class LocalDbService {
  private patientsDb: PouchDB;
  private journalsDb: PouchDB;
  private remoteCouchServer = 'http://admin:admin@127.0.0.1:5984/';
  private SERVER_URL = 'http://127.0.0.1:80/stack1';
  public replicationActive = false;
  public whenLocalPatientsChanges = new Subject();

  constructor(private http: HttpClient,
              private accService: AccountService) {
    this.patientsDb = new PouchDB('patients');
    this.journalsDb = new PouchDB('journals');
    // this.patientsDb.sync(this.remoteCouchServer + 'rep_test', {live: true});
    // Start replication

  }

  public syncPatient(id: string): Promise<any> {
    // syncDom.setAttribute('data-sync-state', 'syncing');

    const returnObservable = new Promise<any>((resolve, reject) => {
      const url = this.SERVER_URL + '/patient/' + id + '/store';
      this.http.post<any>(url, {
        apiKey: this.accService.getApiKey()
      }).toPromise()
        .then(response => {
          if (!this.replicationActive) {
            this.setupFullReplication(response.db)
              .then(resolve);
          } else {
            resolve();
          }
        });
    });

    return returnObservable;
  }

  public unsyncPatient(id: string) {
    this.http.delete(this.SERVER_URL + '/patient/' + id + '/store?apiKey=' + this.accService.getApiKey()).subscribe(response => {
    });
  }

  public getPatients(): Promise<PatientModel[]> {
    return new Promise((resolve, reject) => {
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
          resolve(returnArray);
        });
    });
  }

  public getPatient(id: string): Promise<PatientModel> {
    return new Promise<PatientModel>((resolve, reject) => {
      this.getPatients()
        .then(patients => {
          for (let i = 0; i < patients.length; i++) {
            if (patients[i].id === id) {
              resolve(patients[i]);
              return;
            }
          }
          reject(null);
        });
    });
  }

  public getPatientJournals(patientId: string): Promise<JournalModel[]> {
    return new Promise<JournalModel[]>((resolve, reject) => {
      this.journalsDb.find({
        selector: {
          patientId: patientId
        },
        fields: ['_id', 'submittedAt']
      })
        .then(result => {
          resolve(JournalModel.parseArray(result.docs));
        });
    });
  }

  public getPatientJournal(id: string): Promise<JournalModel> {
    return new Promise<JournalModel>((resolve, reject) => {
      this.journalsDb.find({
        selector: {
          '_id': id
        }
      })
        .then(result => {
          resolve(JournalModel.parseObject(result.docs[0]));
        });
    });
  }

  private setupReplication(localDb: PouchDB, remoteAddress: string, indexFields: string[], onChangeObservable: Subject<any> = null): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      localDb.replicate.from(remoteAddress).on('complete', (info) => {
        console.log('Full replication done from: ' + remoteAddress);
        localDb.createIndex({
          index: {fields: indexFields}
        });
        resolve(info);
        localDb.sync(remoteAddress, {live: true, retry: true})
          .on('error', (errorMsg) => {
            console.log('Syncing error: ', errorMsg);
          })
          .on('change', newData => {
            if (onChangeObservable !== null) {
              onChangeObservable.next(null);
            }
          });
      });
    });
  }

  private setupFullReplication(db: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const remotePatientsDb = this.remoteCouchServer + db + '_patients';
      const remoteJournalsDb = this.remoteCouchServer + db + '_journals';
      // Replicate patients
      this.setupReplication(this.patientsDb, remotePatientsDb, ['_id'], this.whenLocalPatientsChanges)
        .then(data => {
          resolve();
        });
      // ==================
      // Replicate journals
      this.setupReplication(this.journalsDb, remoteJournalsDb, ['_id', 'patientId']);
      this.replicationActive = true;
    });
  }
}

