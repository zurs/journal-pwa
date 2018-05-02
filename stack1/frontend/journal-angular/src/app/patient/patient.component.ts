import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PatientModel} from '../models/patient.model';
import {JournalModel} from '../models/journal.model';
import {PatientsService} from '../services/patients.service';
import {JournalService} from '../services/journal.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  public id: string;
  public patient: PatientModel;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientsService,
    private journalService: JournalService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.patientService.getPatient(this.id).subscribe(patient => {
        this.patient = patient;

      });
    });
  }

  showJournalText(journalId: string) {
    this.journalService.loadJournalText(this.patient.journals, journalId);
  }

}
