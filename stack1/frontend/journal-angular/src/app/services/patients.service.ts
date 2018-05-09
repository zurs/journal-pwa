import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {PatientModel} from '../models/patient.model';
import {JournalService} from './journal.service';
import {LocalDbService} from './localDb.service';


@Injectable()
export class PatientsService {

  private SERVER_URL = 'http://127.0.0.1:80/stack1';


  constructor(
    private http: HttpClient,
    private accService: AccountService,
    private journalService: JournalService,
    private localDbService: LocalDbService) {
  }

  public getPatients(): Observable<PatientModel[]> {
    const apiKey = this.accService.getApiKey();
    const url = this.SERVER_URL + '/patient?apiKey=' + apiKey;

    return this.http.get<PatientModel[]>(url).pipe(
      tap((serverPatients) => {
        this.localDbService.getPatients().subscribe((localPatients) => {
          serverPatients.forEach(patient => {
            const isLocal = localPatients.find((localPatient) => {
              return patient.id === localPatient.id;
            });
            patient.localyStored = !!isLocal;
          });
        });
      }),

    );
  }

  public getPatient(id: string): Observable<PatientModel> {
    const apiKey = this.accService.getApiKey();
    const url = this.SERVER_URL + '/patient/' + id + '?apiKey=' + this.accService.getApiKey();

    return new Observable<PatientModel>(observer => {
      this.localDbService.getPatient(id).subscribe(localData => {
        if (localData !== null) {
          observer.next(localData);
        } else {
          console.log('Calling server to get patient information');
          this.http.get<PatientModel>(url).subscribe(serverData => {
            observer.next(serverData);
          });
        }
      });
    })
      .pipe(
      tap(patient => {
        console.log(patient);
        this.journalService.getPatientJournals(patient.id).subscribe(journals => {
          console.log('Journals: ', journals);
          patient.journals = journals;
        });
      })
    );
  }

  public syncPatient(id: string): Observable<any> {
    return this.localDbService.syncPatient(id);
  }

  public unsyncPatient(id: string) {
    this.localDbService.unsyncPatient(id);
  }
}
