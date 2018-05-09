import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PatientsService} from '../services/patients.service';
import {PatientModel} from '../models/patient.model';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';
import {LocalDbService} from '../services/localDb.service';

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
    private router: Router,
    private localDbService: LocalDbService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.changeDetector.detach();
  }

  ngOnInit() {
    this.updatePatientList();
    this.localDbService.whenLocalPatientsChanges
      .subscribe(data => {
        this.updatePatientList();
        console.log('Subject sent change event');
      });
  }

  private updatePatientList() {
    this.patientService.getPatients()
      .then((patients) => {
        this.patients.splice(0, this.patients.length);
        patients.forEach(patient => {
          this.patients.push(patient);
        });
        this.changeDetector.detectChanges();
        console.log(this.patients);
      });
  }

  onLogoutClicked() {
    this.accService.logout();
    this.router.navigate(['login']);
  }

  onSyncPatientJournals(id: string) {
    this.localDbService.syncPatient(id)
      .then(() => {
        this.updatePatientList();
      });
  }

  onUnsyncPatientJournals(id: string) {
    this.patientService.unsyncPatient(id);
  }

}
