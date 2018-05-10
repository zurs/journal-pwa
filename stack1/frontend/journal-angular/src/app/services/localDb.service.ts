import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {PatientModel} from '../models/patient.model';
import {JournalModel} from '../models/journal.model';
import {Subject} from 'rxjs/Subject';
import {SyncService} from './sync.service';
import { UUID } from 'angular2-uuid';

PouchDB.plugin(PouchDBFind);

@Injectable()
export class LocalDbService {
  private patientsDb: PouchDB;
  private journalsDb: PouchDB;
  private remoteCouchServer = 'http://admin:admin@127.0.0.1:5984/';
  private SERVER_URL = 'http://127.0.0.1:80/stack1';
  public replicationActive = false;
  public whenLocalPatientsChanges = new Subject();
  public whenLocalJournalsChanges = new Subject();

  constructor(private http: HttpClient, private accService: AccountService, private syncService: SyncService) {
    this.patientsDb = new PouchDB('patients');
    this.journalsDb = new PouchDB('journals');

    // Check if there is anything replicated already
    this.patientsDb.allDocs()
      .then(result => {
        if (result.rows.length > 0) {
          this.startDefaultReplication();
        }
      });
  }

  public syncPatient(id: string) {
    this.startDefaultReplication();
    const url = this.SERVER_URL + '/patient/' + id + '/store';
    this.http.post<any>(url, {
      apiKey: this.accService.getApiKey()
    })
      .subscribe();
  }

  public unsyncPatient(id: string) {
    this.startDefaultReplication();
    this.http.delete(this.SERVER_URL + '/patient/' + id + '/store?apiKey=' + this.accService.getApiKey()).subscribe(response => {
    });
  }

  // The default function for setting up the replication
  public startDefaultReplication() {
    if (!this.replicationActive) {
      const url = this.SERVER_URL + '/account/db?apiKey=' + this.accService.getApiKey();
      this.http.get<{db}>(url)
        .subscribe(response => {
          this.setupFullReplication(response.db);
          this.replicationActive = true;
        });
    }
  }

  public getPatients(): Promise<PatientModel[]> {
    return new Promise((resolve, reject) => {
      this.patientsDb.allDocs({
        include_docs: true
      })
        .then(data => {
          let returnArray = [];
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
      this.journalsDb.allDocs({include_docs: true})
        .then(result => {
          result = result.rows.filter(item => {
            return item.doc.patientId === patientId;
          });
          result = result.map(item => {
            return {
              id: item.id,
              writtenAt: item.doc.writtenAt,
              submittedAt: item.doc.submittedAt
            };
          });
          resolve(result);
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

  public newJournalNote(text: string, patientId: string, writtenAt: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const newUUID = UUID.UUID();
      this.journalsDb.put({
        _id: newUUID,
        text: text,
        patientId: patientId,
        writtenAt: writtenAt
      })
        .then(response => {
          this.syncService.addJournalToBeSynced(text, patientId, writtenAt, newUUID);
          resolve();
        });
    });
  }

  private setupReplication(localDb: PouchDB, remoteAddress: string, indexFields: string[], onChangeObservable: Subject<any> = null): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      localDb.replicate.from(remoteAddress).on('complete', (info) => {
        localDb.createIndex({
          index: {
            fields: indexFields
          }
        });
        onChangeObservable.next(null);
        localDb.sync(remoteAddress, {
          live: true,
          retry: true
        })
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
      this.setupReplication(this.journalsDb, remoteJournalsDb, ['_id', 'patientId'], this.whenLocalJournalsChanges);
      this.replicationActive = true;
    });
  }
}

