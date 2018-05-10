import { Component, OnInit } from '@angular/core';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;
  public connectionStatus: boolean;

  constructor(private accService: AccountService, private router: Router) { }

  ngOnInit() {
    // Check if already logged in
    if (!!this.accService.getApiKey()) {
      this.router.navigate(['home']);
    }
    this.connectionStatus = navigator.onLine;
    window.addEventListener('online', _ => { this.connectionStatus = true; });
    window.addEventListener('offline', _ => { this.connectionStatus = false; });
  }

  onSubmit() {
    this.accService.authenticate(this.username, this.password)
      .subscribe(response => {
      if (response.apiKey !== '') {
        this.router.navigate(['home']);
      }
    });
  }

}
