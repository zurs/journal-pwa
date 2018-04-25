import { Component, OnInit } from '@angular/core';
import {AccountService} from '../services/AccountService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;

  constructor(private accService: AccountService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('login clicked');

    this.accService.authenticate(this.username, this.password).subscribe(response => {
      console.log('Response: ', response);
    });
  }

}
