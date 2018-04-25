import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AccountService {
  private SERVER_URL = 'http://127.0.0.1:80/stack1';

  public apiKey: string;
  public username: string;

  constructor(private http: HttpClient) {}

  authenticate(username, password) {
    // Make http with the current credentials

    const url = this.SERVER_URL + '/account/login';

    const sendData = {username, password};

    console.log(sendData);

    return this.http.post<any>(url, sendData, httpOptions).pipe(
      tap(response => { console.log(response); })
    );

  }

}
