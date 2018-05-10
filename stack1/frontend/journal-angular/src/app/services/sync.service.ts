import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';


@Injectable()
export class SyncService {

  public onlineStatus: Subject<boolean>;
  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  constructor(
    private http: HttpClient,
    private accService: AccountService) {
    this.onlineStatus = new Subject();
    window.addEventListener('offline', _ => {
      this.onlineStatus.next(false);
    });
    this.onlineStatus.subscribe((value) => {
      if (value === false) {
        this.activateHeartbeat();
      }
    });
    this.initJournalOfflineSync();
  }

  private activateHeartbeat() {
    const intervalHandler = setInterval(() => {
      this.http.get(this.SERVER_URL + '/heartbeat').toPromise()
        .then(response => {
          this.onlineStatus.next(true);
        });
    }, 1000);
    this.onlineStatus.subscribe(value => {
      if (value === true) {
        clearInterval(intervalHandler);
      }
    });
  }

  public getJournalQueue(): Array<any> {
    let currentQueue = window.localStorage.getItem('journal_queue');
    if (currentQueue === null) {
      window.localStorage.setItem('journal_queue', JSON.stringify([]));
      currentQueue = window.localStorage.getItem('journal_queue');
    }
    return JSON.parse(currentQueue);
  }

  public addJournalToBeSynced(text: string, patientId: string, writtenAt: number, id: string) {
    const currentQueue = this.getJournalQueue();
    currentQueue.push({
      id: id,
      patientId: patientId,
      writtenAt: writtenAt,
      text: text
    });
    console.log('Queue updated with new object');
    console.log(currentQueue);
    window.localStorage.setItem('journal_queue', JSON.stringify(currentQueue));
    return;
  }

  private initJournalOfflineSync() {
    let previousValue = true;
    this.onlineStatus.subscribe(value => {
      if (value === true && previousValue !== value) {
        this.syncJournalQueue();
      }
      previousValue = value;
    });
  }

  private syncJournalQueue() {
    const queue = this.getJournalQueue();
    if (queue.length === 0) {
      return;
    }

    for (let i = 0; i < queue.length; i++) {
      if (typeof queue[i + 1] !== 'undefined') {
        queue[i].next = queue[i + 1];
      }
    }
    // Start sending recursively
    this.syncSingleQueueItem(queue[0]);
  }

  private syncSingleQueueItem(item) {
    console.log('Syncing this item: ');
    console.log(item);
    this.sendJournalNoteToServer(item.text, item.patientId, item.writtenAt, item.id)
      .then(response => {
        this.removeJournalFromQueue(item.id);
        if (typeof item.next !== 'undefined') {
          this.syncSingleQueueItem(item.next);
        }
      });
  }

  private removeJournalFromQueue(id: string) {
    let queue = this.getJournalQueue();
    queue = queue.filter((item) => {
      return item.id !== id;
    });
    window.localStorage.setItem('journal_queue', JSON.stringify(queue));
  }

  private sendJournalNoteToServer(text: string, patientId: string, writtenAt: number, id: string): Promise<any> {
    const url = this.SERVER_URL + '/journal';

    const sendData = {
      apiKey: this.accService.getApiKey(),
      writtenAt: writtenAt,
      text: text,
      patientId: patientId,
      id: id
    };

    return new Promise<any>((resolve, reject) => {
      this.http.post(url, sendData).toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          this.onlineStatus.next(false);
          reject();
        });
    });
  }
}
