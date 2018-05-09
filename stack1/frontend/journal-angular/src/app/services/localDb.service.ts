import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {JournalService} from './journal.service';
import {PatientsService} from './patients.service';
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

  constructor(private http: HttpClient,
              private accService: AccountService) {
    this.patientsDb = new PouchDB('patients');
    this.journalsDb = new PouchDB('journals');
    // this.patientsDb.sync(this.remoteCouchServer + 'rep_test', {live: true});
  }

  public syncPatient(id: string): Observable<any> {
    // syncDom.setAttribute('data-sync-state', 'syncing');

    const returnObservable = new Observable<any>(observer => {
      const url = this.SERVER_URL + '/patient/' + id + '/store?apiKey=' + this.accService.getApiKey();
      this.http.get<any>(url).subscribe(response => {
        const remotePatientsDb = this.remoteCouchServer + response.patients;
        const remoteJournalsDb = this.remoteCouchServer + response.journals;
        // Replicate patients
        this.patientsDb.sync(remotePatientsDb, {live: true})
          .on('complete', (data) => {
            console.log('Replication of patient done');
            this.patientsDb.createIndex({
              index: {fields: ['id']}
            });
            observer.next(data);
          })
          .on('error', (errorMsg) => {
            console.log('Syncing error: ', errorMsg);
          })
          .on('change', newData => {
            console.log('Patients database changed.');
            observer.next(newData);
          });
        // ==================
        // Replicate journals
        this.journalsDb.sync(remoteJournalsDb, {live: true})
          .on('complete', () => {
            console.log('Journal replication done');
            this.patientsDb.createIndex({
              index: {fields: ['patientId']}
            });
          })
          .on('error', (errorMsg) => {
          console.log('Syncing error: ', errorMsg);
        });
      });
    });

    return returnObservable;
  }

  public unsyncPatient(id: string) {
    this.http.delete(this.SERVER_URL + 'patient/' + id + '/store').subscribe(response => {
      console.log('Patient is or is about to get unsynced');
    });
  }

  public getPatients(): Observable<PatientModel[]> {
    return new Observable<PatientModel[]>(observer => {
      this.patientsDb.allDocs({include_docs: true})
        .then(data => {
          console.log('Hej', data);
          let returnArray = [];
          if (data.total_rows === 0) {
            returnArray = [];
          } else {
            returnArray = data.rows.map(function (patient) {
              const newPatient = new PatientModel(patient.id, patient.name, patient.ssn);
              newPatient.localyStored = true;
              return newPatient;
            });
          }
          observer.next(returnArray);
        });
    });
  }

  public getPatientJournals(patientId: string): Observable<JournalModel[]> {
    return new Observable<JournalModel[]>(observer => {
      this.journalsDb.find({
        selector: {
          'patientId': patientId
        },
        fields: ['_id', 'submittedAt']
      })
        .then(result => {
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
}

