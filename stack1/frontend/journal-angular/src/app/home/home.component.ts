import { Component, OnInit } from '@angular/core';
import {PatientsService} from '../services/patients.service';
import {PatientModel} from '../models/patient.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public patients: PatientModel[] = [];

  constructor(
    private patientService: PatientsService
  ) { }

  ngOnInit() {
    this.patientService.getPatients().subscribe((response) => {
      response.forEach(patientJson => {
        this.patients.push(PatientModel.parseFromJson(patientJson));
      });
    });
  }

}
