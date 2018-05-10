import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {CanActivate} from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AccountService {
  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  private apiKey: string;

  constructor(private http: HttpClient) {
  }

  authenticate(username, password) {
    // Make http with the current credentials

    const url = this.SERVER_URL + '/account/login';

    const sendData = {username, password};

    return this.http.post<any>(url, sendData, httpOptions).pipe(
      tap(response => {
        this.apiKey = response.apiKey;
        window.localStorage.setItem('apiKey', this.apiKey);
      })
    );
  }

  public getApiKey(): string {
    if (!this.apiKey) {
      const localApiKey = window.localStorage.getItem('apiKey');
      if (localApiKey) {
        this.apiKey = localApiKey;
      }
    }
    return this.apiKey;
  }

  public logout() {
    this.apiKey = null;
    window.localStorage.setItem('apiKey', '');
  }
}
