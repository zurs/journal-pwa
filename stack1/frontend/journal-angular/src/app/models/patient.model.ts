import {JournalModel} from './journal.model';

export class PatientModel {
  public id: string;
  public name: string;
  public ssn: string;
  public journals: JournalModel[];

  public constructor(id: string, name: string, ssn: string) {
    this.id = id;
    this.name = name;
    this.ssn = ssn;
  }

  public static parseFromJson(patientJson: any): PatientModel {
    return new PatientModel(patientJson.id, patientJson.name, patientJson.ssn);
  }
}
