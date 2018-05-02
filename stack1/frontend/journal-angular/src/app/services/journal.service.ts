import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JournalModel} from '../models/journal.model';
import {tap} from 'rxjs/operators';
import {AccountService} from './account.service';


@Injectable()
export class JournalService {
  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  constructor(private http: HttpClient,
              private accService: AccountService) { }

  public getPatientJournals(patientId: string) {
    const url = this.SERVER_URL + '/patient/' + patientId + '/journals?apiKey=' + this.accService.getApiKey();
    return this.http.get<JournalModel[]>(url).pipe(
      tap(journals => {
        journals.forEach(note => { note.submittedAt = String(+note.submittedAt * 1000); });
      })
    );
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
