
export class JournalModel {
  public id: string;
  public text: string;
  public submittedAt: string;

  public static parseArray(dbJournals: JournalModel[]): JournalModel[] {
    return dbJournals.map(function(journal) {
      journal.id = journal._id;
      return journal;
    });
  }
}
