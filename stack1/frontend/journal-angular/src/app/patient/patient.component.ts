import {Component, OnInit} from '@angular/core';
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
  public newNoteBool: boolean;
  public newNoteText: string;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientsService,
    private journalService: JournalService
  ) {
  }

  ngOnInit() {
    this.loadPatient();
  }

  showJournalText(journalId: string) {
    this.journalService.loadJournalText(this.patient.journals, journalId);
  }

  private loadPatient() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.patientService.getPatient(this.id)
        .then(patient => {
          this.patient = patient;
        });
    });
  }

  newNote() {
    this.journalService.newJournalNote(this.newNoteText, this.id).subscribe(response => {
      this.loadPatient();
      this.newNoteText = '';
      this.newNoteBool = false;
    });
  }

}
