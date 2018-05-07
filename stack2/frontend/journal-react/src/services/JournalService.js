import axios from 'axios';
import AccountService from "./AccountService";

const Request = axios.create({
	baseURL: 'http://localhost/stack2/journal',
	headers: {
		'Content-Type': 'application/json'
	}
});

const JournalService = {
		getJournal(journalId) {
			return new Promise((success, fail) => {
				Request.get('/' + journalId, {
					params: {
						apiKey: AccountService.getApiKey()
					}
				}).then((response) => {
					success(response.data);
				}).catch(() => {
					fail("failed");
				})
			});
		},
		createJournal(journal) {
			return new Promise((success, fail) => {
				Request.post('', journal, {
						params: {
						apiKey: AccountService.getApiKey()
					}
				}).then((response) => {
					success(response.data);
				}).catch(() => {
					fail("failed");
				});
			});
		}
};

export default JournalService;