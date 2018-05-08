import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JournalModel} from '../models/journal.model';
import {tap} from 'rxjs/operators';
import {AccountService} from './account.service';
import {LocalDbService} from './localDb.service';
import {Observable} from 'rxjs/Observable';
import {PatientModel} from '../models/patient.model';


@Injectable()
export class JournalService {
  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  constructor(private http: HttpClient,
              private accService: AccountService,
              private localDbService: LocalDbService) {
  }

  public getPatientJournals(patientId: string): Observable<JournalModel[]> {
    const url = this.SERVER_URL + '/patient/' + patientId + '/journals?apiKey=' + this.accService.getApiKey();

    const jo = new Observable<JournalModel[]>(observable => {
      this.localDbService.getPatients()
        .subscribe((response) => {
          const doesExist = response.find((patient: PatientModel) => {
            if (patient.id === patientId && patient.localyStored) {
              return true;
            }
            return false;
          });

          if (doesExist) {
            console.log('Getting the journals from local database');
            this.localDbService.getPatientJournals(patientId).subscribe(data => {
              console.log(data);
              observable.next(data);
            });
          } else {
            console.log('Getting the journals from the server');
            this.http.get<JournalModel[]>(url).subscribe(data => {
              observable.next(data);
            });
          }
        });
    });
    return jo.pipe(
      tap(journals => {
        journals.forEach(note => {
          console.log('Trying to convert here: ' + note);
          note.submittedAt = String(+note.submittedAt * 1000);
        });
      }));
  }

  public getJournal(id: string) {
    const url = this.SERVER_URL + '/journal/' + id + '?apiKey=' + this.accService.getApiKey();
    return this.http.get<JournalModel>(url).pipe(
      tap(journal => {
        journal.submittedAt = String(+journal.submittedAt * 1000);
      })
    );
  }

  public loadJournalText(journalsArray: JournalModel[], journalId: string) {
    this.getJournal(journalId).subscribe(journal => {
      for (let i = 0; i < journalsArray.length; i++) {
        if (journalsArray[i].id === journal.id) {
          journalsArray[i] = journal;
        }
      }
    });
  }

  public newJournalNote(text: string, patientId: string) {
    const writtenAt = Math.round((new Date()).getTime() / 1000);
    const url = this.SERVER_URL + '/journal';

    const sendData = {
      apiKey: this.accService.getApiKey(),
      writtenAt: writtenAt,
      text: text,
      patientId: patientId
    };

    return this.http.post(url, sendData);
  }
}
