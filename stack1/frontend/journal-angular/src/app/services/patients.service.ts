import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {PatientModel} from '../models/patient.model';
import {JournalService} from './journal.service';
import {LocalDbService} from './localDb.service';
import {toPromise} from 'rxjs/operator/toPromise';
import {SyncService} from './sync.service';


@Injectable()
export class PatientsService {

  private SERVER_URL = 'http://127.0.0.1:80/stack1';


  constructor(
    private http: HttpClient,
    private accService: AccountService,
    private journalService: JournalService,
    private localDbService: LocalDbService,
    private syncService: SyncService) {
  }

  public getPatients(): Promise<PatientModel[]> {
    const apiKey = this.accService.getApiKey();
    const url = this.SERVER_URL + '/patient?apiKey=' + apiKey;

    return new Promise((resolve, reject) => {
      this.http.get<PatientModel[]>(url)
        .toPromise()
        .then((serverPatients) => {
          this.localDbService.getPatients()
            .then(localPatients => {
              serverPatients.forEach(patient => {
                const isLocal = localPatients.find((localPatient) => {
                  return patient.id === localPatient.id;
                });
                patient.localyStored = !!isLocal;
              });
              resolve(serverPatients);
            });
        })
        .catch(() => {
          this.syncService.onlineStatus.next(false);
          this.localDbService.getPatients()
            .then(patients => {
              resolve(patients);
            });
        });
    });
  }

  public getPatient(id: string): Promise<PatientModel> {
    const url = this.SERVER_URL + '/patient/' + id + '?apiKey=' + this.accService.getApiKey();

    return new Promise<PatientModel>((resolve, reject) => {
      this.localDbService.getPatient(id)
        .then(localPatient => {
          this.injectPatientWithJournals(localPatient)
            .then(patient => {
              resolve(patient);
            });
        })
        .catch(() => {
          this.http.get<PatientModel>(url)
            .toPromise()
            .then(serverPatient => {
              this.injectPatientWithJournals(serverPatient)
                .then(patient => {
                  resolve(patient);
                });
            });
        });
    });
  }

  private injectPatientWithJournals(patient: PatientModel): Promise<PatientModel> {
    return new Promise((resolve, reject) => {
      this.journalService.getPatientJournals(patient.id)
        .then(journals => {
          patient.journals = journals;
          resolve(patient);
        });
    });
  }

  public unsyncPatient(id: string) {
    this.localDbService.unsyncPatient(id);
  }
}
