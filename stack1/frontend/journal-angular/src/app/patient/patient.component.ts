import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PatientModel} from '../models/patient.model';
import {JournalModel} from '../models/journal.model';
import {PatientsService} from '../services/patients.service';
import {JournalService} from '../services/journal.service';
import {LocalDbService} from '../services/localDb.service';

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

  constructor(private route: ActivatedRoute, private patientService: PatientsService, private journalService: JournalService, private changeDetector: ChangeDetectorRef, private localDbService: LocalDbService) {
  }

  ngOnInit() {
    // this.changeDetector.detach();
    this.loadPatient();
    this.localDbService.whenLocalJournalsChanges
      .subscribe(data => {
        if (this.patient.localyStored) {
          this.loadPatient();
        }
      });
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
          this.changeDetector.detectChanges();
        });
    });
  }

  newNote() {
    this.journalService.newJournalNote(this.newNoteText, this.id)
      .then(response => {
        this.loadPatient();
        this.newNoteText = '';
        this.newNoteBool = false;
      });
  }

}
