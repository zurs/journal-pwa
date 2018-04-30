import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';


@Injectable
class PatientsService {

  constructor(
    private http: HttpClient,
    private accService: AccountService
    ) { }

  public getPatients() {
    const apiKey = this.accService.apiKey;

    this.http.get()
  }

}
