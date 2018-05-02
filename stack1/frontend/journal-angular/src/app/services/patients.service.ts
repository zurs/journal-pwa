import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {PatientModel} from '../models/patient.model';
import {JournalService} from './journal.service';


@Injectable()
export class PatientsService {

  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  constructor(
    private http: HttpClient,
    private accService: AccountService,
    private journalService: JournalService) {
  }

  public getPatients(): Observable<PatientModel[]> {
    const apiKey = this.accService.getApiKey();

    const url = this.SERVER_URL + '/patient?apiKey=' + this.accService.getApiKey();
    return this.http.get<PatientModel[]>(url);
  }

  public getPatient(id: string) {
    const apiKey = this.accService.getApiKey();
    const url = this.SERVER_URL + '/patient/' + id + '?apiKey=' + this.accService.getApiKey();

    return this.http.get<PatientModel>(url).pipe(
      tap(patient => {
        this.journalService.getPatientJournals(patient.id).subscribe(journals => {
          patient.journals = journals;
        });
      })
    );
  }

}
