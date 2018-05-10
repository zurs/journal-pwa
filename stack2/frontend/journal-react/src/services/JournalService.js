import AccountService from "./AccountService";
import StoreService from "./StoreService";
import {Request as RequestUtil} from "../util/Request";

const Request = RequestUtil.create('journal');

const JournalService = {
		getJournal(journalId) {
			return new Promise((success, fail) => {
				Request.get('/' + journalId, {
					params: {
						apiKey: AccountService.getApiKey()
					}
				})
				.then((response) => {
					success(response.data);
				})
				.catch(() => {
					return StoreService.getJournal(journalId)
						.then((journal) => {
							StoreService.createLog({journalId: journalId});
							success(journal);
						})
						.catch(() => {
							fail();
						});
				});
			});
		},
		createJournal(journal) {
			return new Promise((success) => {
				Request.post('', journal, {
						params: {
						apiKey: AccountService.getApiKey()
					}
				})
				.then((response) => {
					StoreService.getPatient(journal.patientId)
						.then(() => {
							 StoreService.createJournal(response.data);
						})
						.finally(() => {
							response.data.text = null;
							success(response.data);
						});
				})
				.catch(() => {
					StoreService.createLocalJournal(journal)
						.then((response) => {
							response.text = null;
							success(response);
						});
				});
			});
		}
};

export default JournalService;