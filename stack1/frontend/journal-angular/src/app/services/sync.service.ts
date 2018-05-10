import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';


@Injectable()
export class SyncService {

  public onlineStatus: Subject<boolean>;
  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  private JOURNAL_QUEUE = 'journal_queue';
  private LOGS_QUEUE = 'logs_queue';

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
    this.initOfflineSync();
  }

  private activateHeartbeat() {
    const intervalHandler = setInterval(() => {
      this.http.get(this.SERVER_URL + '/heartbeat').toPromise()
        .then(response => {
          this.onlineStatus.next(true);
        });
    }, 1000);
    this.onlineStatus
      .subscribe(value => {
        if (value === true) {
          clearInterval(intervalHandler);
        }
      });
  }

  public getQueue(queue: string): Array<any> {
    let currentQueue = window.localStorage.getItem(queue);
    if (currentQueue === null) {
      window.localStorage.setItem(queue, JSON.stringify([]));
      currentQueue = window.localStorage.getItem(queue);
    }
    return JSON.parse(currentQueue);
  }

  public addJournalToBeSynced(text: string, patientId: string, writtenAt: number, id: string) {
    const currentQueue = this.getQueue(this.JOURNAL_QUEUE);
    currentQueue.push({
      id: id,
      patientId: patientId,
      writtenAt: writtenAt,
      text: text
    });
    window.localStorage.setItem(this.JOURNAL_QUEUE, JSON.stringify(currentQueue));
    return;
  }

  private initOfflineSync() {
    let previousValue = true;
    this.onlineStatus.subscribe(value => {
      if (value === true && previousValue !== value) {
        this.syncJournalQueue();
        if (this.getQueue(this.LOGS_QUEUE).length > 0) {
          this.sendLogQueueToServer();
        }
      }
      previousValue = value;
    });
  }

  private syncJournalQueue() {
    const queue = this.getQueue(this.JOURNAL_QUEUE);
    if (queue.length === 0) {
      return;
    }

    for (let i = 0; i < queue.length; i++) {
      if (typeof queue[i + 1] !== 'undefined') {
        queue[i].next = queue[i + 1];
      }
    }
    // Start sending recursively
    this.syncSingleJournalQueueItem(queue[0]);
  }

  private syncSingleJournalQueueItem(item) {
    this.sendJournalNoteToServer(item.text, item.patientId, item.writtenAt, item.id)
      .then(response => {
        this.removeJournalFromQueue(item.id);
        if (typeof item.next !== 'undefined') {
          this.syncSingleJournalQueueItem(item.next);
        }
      });
  }

  private removeJournalFromQueue(id: string) {
    let queue = this.getQueue(this.JOURNAL_QUEUE);
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
      this.http.post(url, sendData)
        .toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          this.onlineStatus.next(false);
          reject();
        });
    });
  }

  public addLogToBeSynced(log) {
    const currentQueue = this.getQueue(this.LOGS_QUEUE);
    currentQueue.push(log);
    window.localStorage.setItem(this.LOGS_QUEUE, JSON.stringify(currentQueue));
  }

  private sendLogQueueToServer(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const url = this.SERVER_URL + '/log/sync';
      const body = {
        apiKey: this.accService.getApiKey(),
        logs: this.getQueue(this.LOGS_QUEUE)
      };
      this.http.post(url, body)
        .toPromise()
        .then(response => {
          window.localStorage.removeItem(this.LOGS_QUEUE);
          resolve();
        })
        .catch(error => {
          reject();
        });
    });
  }
}
