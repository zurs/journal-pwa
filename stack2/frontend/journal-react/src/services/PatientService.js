import AccountService from "./AccountService";
import StoreService from "./StoreService";
import {Request as RequestUtil} from "../util/Request";

const Request = RequestUtil.create('patient');

const PatientService = {
	getPatients() {
		return new Promise((success) => {
			let patients = [];
			Request.get('', {
				params: {
				apiKey: AccountService.getApiKey()
				}
			})
			.then((response) => {
				patients = response.data;
			})
			.finally(() => {
			StoreService.getPatients()
				.then((stored) => {
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
		return new Promise((success) => {
			StoreService.getPatient(patientId)
				.then((patient) => {
					success(patient);
				})
				.catch(() => {
					Request.get('/' + patientId, {
						params: {
							apiKey: AccountService.getApiKey()
						}
					})
					.then((response) => {
						success(response.data);
					})
					.catch(() => {
					});
				});
		});
	},
	getJournals(patientId) {
		return new Promise((success) => {
			let journals = [];
			Request.get('/' + patientId + '/journals', {
				params: {
					apiKey: AccountService.getApiKey()
				}
			})
			.then((response) => {
				journals = response.data;
			})
			.finally(() => {
				StoreService.getJournals(patientId)
					.then((stored) => {
						journals = journals.filter((journal) => {
							const isDuplicated = stored.some((store) => {
								return store.id === journal.id;
							});
							return !isDuplicated;
						});
						const all = stored.concat(journals);
						success(all);
				});
			});
		});
	}
};

export default PatientService;