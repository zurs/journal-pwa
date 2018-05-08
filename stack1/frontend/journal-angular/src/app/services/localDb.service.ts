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
  private patientsDb = new PouchDB('patients');
  private journalsDb = new PouchDB('journals');
  private remoteCouchServer = 'http://admin:admin@127.0.0.1:5984/';
  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  constructor(private http: HttpClient,
              private accService: AccountService) {
  }

  public syncPatient(id: string) {
    // syncDom.setAttribute('data-sync-state', 'syncing');

    const url = this.SERVER_URL + '/patient/' + id + '/store?apiKey=' + this.accService.getApiKey();
    this.http.get<any>(url).subscribe(response => {
      console.log(response);
      const remotePatientsDb = this.remoteCouchServer + response.patientsDB;
      const remoteJournalsDb = this.remoteCouchServer + response.journalsDB;

      const opts = {live: true};
      // Replicate patients
      this.patientsDb.replicate.from(remotePatientsDb, opts).on('complete', () => {
        this.patientsDb.createIndex({
          index: {fields: ['id']}
        });
      }).on('error', (errorMsg) => {
          console.log('Syncing error: ', errorMsg);
        });
      // Replicate journals
      this.journalsDb.replicate.from(remoteJournalsDb, opts).on('complete', () => {
        this.patientsDb.createIndex({
          index: {fields: ['id', 'patientId']}
        });
      }).on('error', (errorMsg) => {
        console.log('Syncing error: ', errorMsg);
      });
    });
  }

  public getPatients(): Promise<PatientModel[]> {
    return new Promise<PatientModel[]>((resolve, reject) => {
      this.patientsDb.allDocs({include_docs: true}, (patients) => {
        let returnArray = [];
        if (!patients) {
          returnArray = [{id: 'dabda2befa5955343cc72645ea029c85'}];
        } else {
          returnArray = patients.map(function(patient) {
            const newPatient = new PatientModel(patient.id, patient.name, patient.ssn);
            newPatient.localyStored = true;
            return newPatient;
          });
        }
        resolve(returnArray);
      });
    });
  }

  public getPatientJournals(patientId: string): Observable<JournalModel[]> {
    const jo = new Observable<JournalModel[]>(observer => {
      this.journalsDb.find({
        selector: {
          'patientId': patientId
        },
        sort: ['writtenAt']
      }).then(result => {
        observer.next(result);
        observer.complete();
      });
    });
    return jo;
  }
}
