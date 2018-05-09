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

  public getPatientJournals(patientId: string): Promise<JournalModel[]> {
    const url = this.SERVER_URL + '/patient/' + patientId + '/journals?apiKey=' + this.accService.getApiKey();

    return new Promise<JournalModel[]>((resolve, reject) => {
      this.localDbService.getPatients()
        .then((response) => {
          const doesExist = response.find((patient: PatientModel) => {
            return (patient.id === patientId && patient.localyStored);
          });

          if (doesExist) {
            console.log('Getting the journals from local database');
            this.localDbService.getPatientJournals(patientId)
              .then(data => {
                resolve(this.convertUnixTimeToJavascriptUnixInArray(data));
              });
          } else {
            console.log('Getting the journals from the server');
            this.http.get<JournalModel[]>(url).subscribe(data => {
              resolve(this.convertUnixTimeToJavascriptUnixInArray(data));
            });
          }
        });
    });
  }

  private convertUnixTimeToJavascriptUnixInArray(journals: JournalModel[]): JournalModel[] {
    journals.forEach(note => {
      note.submittedAt = String(+note.submittedAt * 1000);
    });
    return journals;
  }

  private convertUnixTimeToJavascriptUnix(journal: JournalModel): JournalModel {
    journal.submittedAt = String(+journal.submittedAt * 1000);
    return journal;
  }

  public getJournal(id: string): Promise<JournalModel> {
    const url = this.SERVER_URL + '/journal/' + id + '?apiKey=' + this.accService.getApiKey();

    return new Promise<JournalModel>((resolve, reject) => {
      this.localDbService.getPatientJournal(id)
        .then(journal => {
          if (journal) {
            resolve(this.convertUnixTimeToJavascriptUnix(journal));
          } else {
            this.http.get<JournalModel>(url).subscribe(serverJournal => {
              resolve(this.convertUnixTimeToJavascriptUnix(serverJournal));
            });
          }
        });
    });
  }

  public loadJournalText(journalsArray: JournalModel[], journalId: string) {
    this.getJournal(journalId)
      .then(journal => {
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
