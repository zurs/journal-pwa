import axios from 'axios';
import AccountService from "./AccountService";
import StoreService from "./StoreService";

const Request = axios.create({
	baseURL: 'http://localhost/stack2/patient',
	headers: {
		'Content-Type': 'application/json'
	}
});

const PatientService = {
	getPatients() {
		return new Promise((success) => {
			let patients = [];
			Request.get('', {
				params: {
				apiKey: AccountService.getApiKey()
				}
			}).then((response) => {
				patients = response.data;
			}).finally(() => {
				StoreService.getPatients().then((stored) => {
					patients = patients.filter((patient) => {
						const isDuplicated = stored.some((store) => {
							return store.id === patient.id;
						});
						return !isDuplicated;
						});

					const all = stored.concat(patients);
					success(all);
				})
			});
		});
	},
	getPatient(patientId) {
		return new Promise((success, fail) => {
			Request.get('/' + patientId, {
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
	getJournals(patientId) {
		return new Promise((success, fail) => {
			Request.get('/' + patientId + '/journals', {
				params: {
					apiKey: AccountService.getApiKey()
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