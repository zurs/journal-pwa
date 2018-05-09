import PatientService from "./PatientService";
import JournalService from "./JournalService";

const StoreService = {
	getJournals(patientId) {
		return new Promise((success) => {
			const journalIds = [];
			Object.keys(localStorage).forEach((key) => {
				const keySplit = key.split('/');
				if(keySplit.length === 4 && keySplit[1] === patientId) {
					journalIds.push(keySplit[3]);
				}
			});

			const promises = journalIds.map((journalId) => {
				return this.getJournal(journalId);
			});

			Promise.all(promises).then((journals) => {
				journals = journals.map((journal) => {
					journal.text = null;
					journal.writtenAt = null;
					journal.authorId = null;
					return journal;
				});
				success(journals);
			});
		});
	},
	getJournal(journalId) {
		return new Promise((success, fail) => {
			const uri = Object.keys(localStorage).find((key) => {
				const keySplit = key.split('/');
				return keySplit.length === 4 && keySplit[3] === journalId;
			});
			if(uri === undefined) {
				fail();
			} else {
				const storedJournal = localStorage.getItem(uri);
				success(JSON.parse(storedJournal));
			}
		});
	},
	createJournal(journal) {
		return new Promise((success) => {
			localStorage.setItem('patient/'+journal.patientId+'/journal/'+journal.id, JSON.stringify(journal));
			success();
		});
	},
	createPatient(patient) {
		return new Promise((success) => {
			patient.offline = true;
			localStorage.setItem('patient/' + patient.id, JSON.stringify(patient));
			PatientService.getJournals(patient.id).then((journals) => {
				const promises = journals.map((journal) => {
					return JournalService.getJournal(journal.id);
				});
				return Promise.all(promises);
			}).then((journals) => {
				const promises = journals.map((journal) => {
					return this.createJournal(journal);
				});
				return Promise.all(promises);
			}).then(() => {
				success();
			});
		});
	},
	getPatient(patientId) {
		return new Promise((success, fail) => {
			const storedData = localStorage.getItem('patient/' + patientId);
			if(storedData === null) {
				fail();
			} else {
				success(JSON.parse(storedData));
			}
		});
	},
	deletePatient(patientId) {
		return new Promise((success) => {
			localStorage.removeItem('patient/' + patientId);
			success();
		});
	},
	getPatients() {
		return new Promise((success) => {
			let patientIds = [];
			Object.keys(localStorage).forEach((key) => {
				const keySplit = key.split("/");
				if(keySplit[0] === 'patient' && keySplit.length === 2) {
					patientIds.push(keySplit[1]);
				}
			});
			const promises = patientIds.map((patientId) => {
				return this.getPatient(patientId).then((patient) => {
					return patient;
				});
			});

			Promise.all(promises).then((patients) => {
					success(patients);
				});
		});
	}
};

export default StoreService;