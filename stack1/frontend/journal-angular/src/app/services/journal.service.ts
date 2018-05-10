import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JournalModel} from '../models/journal.model';
import {tap} from 'rxjs/operators';
import {AccountService} from './account.service';
import {LocalDbService} from './localDb.service';
import {Observable} from 'rxjs/Observable';
import {PatientModel} from '../models/patient.model';
import {SyncService} from './sync.service';


@Injectable()
export class JournalService {
  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  constructor(private http: HttpClient,
              private accService: AccountService,
              private localDbService: LocalDbService,
              private syncService: SyncService) {
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
            this.localDbService.getPatientJournals(patientId)
              .then(data => {
                resolve(this.convertUnixTimeToJavascriptUnixInArray(data));
              });
          } else {
            this.http.get<JournalModel[]>(url).toPromise()
              .then(data => {
              resolve(this.convertUnixTimeToJavascriptUnixInArray(data));
            })
              .catch(_ => {
                this.syncService.onlineStatus.next(false);
              });
          }
        });
    });
  }

  private convertUnixTimeToJavascriptUnixInArray(journals: JournalModel[]): JournalModel[] {
    journals.forEach(note => {
      note.submittedAt = String(+note.submittedAt * 1000);
      note.writtenAt = String(+note.writtenAt * 1000);
    });
    return journals;
  }

  private convertUnixTimeToJavascriptUnix(journal: JournalModel): JournalModel {
    journal.submittedAt = String(+journal.submittedAt * 1000);
    journal.writtenAt = String(+journal.writtenAt * 1000);
    return journal;
  }

  public getJournal(id: string): Promise<JournalModel> {
    const url = this.SERVER_URL + '/journal/' + id + '?apiKey=' + this.accService.getApiKey();

    return new Promise<JournalModel>((resolve, reject) => {
      this.localDbService.getPatientJournal(id)
        .then(journal => {
          if (journal) {
            this.addJournalLog(journal.id);
            resolve(this.convertUnixTimeToJavascriptUnix(journal));
          } else {
            this.http.get<JournalModel>(url).toPromise()
              .then(serverJournal => {
              resolve(this.convertUnixTimeToJavascriptUnix(serverJournal));
            })
              .catch(_ => {
                this.syncService.onlineStatus.next(false);
              });
          }
        });
    });
  }

  private addJournalLog(journalId: string) {
    const url = this.SERVER_URL + '/log/sync';
    const newLog = {
      journalId: journalId,
      readAt: Math.round((new Date()).getTime() / 1000)
    };
    const body = {
      apiKey: this.accService.getApiKey(),
      logs: [newLog]
    };
    this.http.post(url, body).toPromise()
      .then(response => {
        console.log('Journal log uploaded');
      })
      .catch(error => {
        console.log('Could not upload log record');
        this.syncService.addLogToBeSynced(newLog);
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

  public newJournalNote(text: string, patientId: string): Promise<any> {
    const writtenAt = Math.round((new Date()).getTime() / 1000);
    const url = this.SERVER_URL + '/journal';

    const sendData = {
      apiKey: this.accService.getApiKey(),
      writtenAt: writtenAt,
      text: text,
      patientId: patientId
    };

    return new Promise<any>((resolve, reject) => {
      this.http.post(url, sendData).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          this.syncService.onlineStatus.next(false);
          this.localDbService.newJournalNote(text, patientId, writtenAt);
          resolve();
        });
    });
  }
}
