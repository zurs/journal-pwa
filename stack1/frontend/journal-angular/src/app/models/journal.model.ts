export class JournalModel {
  public id: string;
  public text: string;
  public submittedAt: string;
  public writtenAt: string;

  public static parseArray(dbJournals: JournalModel[]): JournalModel[] {
    return dbJournals.map(this.parseObject);
  }

  public static parseObject(dbJournal): JournalModel {
    if (typeof dbJournal !== 'undefined') {
      dbJournal.id = dbJournal._id;
    }
    return dbJournal;
  }
}
