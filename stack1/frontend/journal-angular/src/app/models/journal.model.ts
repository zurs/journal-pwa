export class JournalModel {
  public id: string;
  public text: string;
  public submittedAt: string;

  public static parseArray(dbJournals: JournalModel[]): JournalModel[] {
    return dbJournals.map(this.parseObject);
  }

  public static parseObject(dbJournal: JournalModel): JournalModel {
    if (typeof dbJournal !== 'undefined') {
      dbJournal.id = dbJournal._id;
    }
    return dbJournal;
  }
}
