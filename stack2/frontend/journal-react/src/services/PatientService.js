import axios from 'axios';
import AccountService from "./AccountService";

const Request = axios.create({
	baseURL: 'http://localhost/stack2/patient',
	headers: {
		'Content-Type': 'application/json'
	}
});

const PatientService = {
	getPatients(callback) {
		return Request.get('', {
			params: {
				apiKey: AccountService.apiKey
			}
		}).then((response) => {
			callback(response.data)
		});
	},
	getJournals(patientId) {
		return new Promise((success, fail) => {
			Request.get('/' + patientId + '/journals', {
				params: {
					apiKey: AccountService.apiKey
				}
			}).then((response) => {
				success(response.data);
			}).catch(() => {
				fail("failed");
			})
		});
	}
};

export default PatientService;