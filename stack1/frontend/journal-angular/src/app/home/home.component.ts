import { Component, OnInit } from '@angular/core';
import {PatientsService} from '../services/patients.service';
import {PatientModel} from '../models/patient.model';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public patients: PatientModel[] = [];

  constructor(
    private patientService: PatientsService,
    private accService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.updatePatientList();
  }
  private updatePatientList() {
    this.patientService.getPatients().subscribe((patients) => {
      this.patients = patients;
    });
  }

  onLogoutClicked() {
    this.accService.logout();
    this.router.navigate(['login']);
  }

  onSyncPatientJournals(id: string) {
    this.patientService.syncPatient(id).subscribe(newData => {
      console.log('Local database have changed');
      this.updatePatientList();
    });
  }

  onUnsyncPatientJournals(id: string) {
    this.patientService.unsyncPatient(id);
  }

}
