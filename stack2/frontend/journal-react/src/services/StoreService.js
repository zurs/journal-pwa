import PatientService from "./PatientService";
import JournalService from "./JournalService";
import uuid from 'uuid/v4';
const StoreService = {
	syncStorage() {
		console.log("sync storage");
		this.getPatients().then((patients) => {
				const promises = patients.map((patient) => {
					return this.getLocalJournals(patient.id);
				});
				return Promise.all(promises);
			}).then((journals) => {
				let all = [];
				journals.forEach((journal) => {
					all = all.concat(all ,journal);
				});
				return Promise.resolve(all);
			}).then((journals) => {
				const promises = journals.map((journal) => {
					return JournalService.createJournal(journal);
				});
				return Promise.all(promises);
			}).then((journals) => {
			console.log("success!");
			console.log("pushed: ");
			console.log(journals);
			console.log("clearing storage");
			this.deleteLocalJournals();

		});
	},
	getJournals(patientId) {
		return new Promise((success) => {
			const journalIds = [];
			Object.keys(localStorage).forEach((key) => {
				const keySplit = key.split('/');
				if(keySplit.length === 4 && keySplit[1] === patientId && keySplit[2] !== 'local') {
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
	deleteLocalJournals() {
		return new Promise((success) => {
			this.getPatients()
				.then((patients) => {
					patients.forEach((patient) => {
						localStorage.removeItem('patient/'+patient.id+'/local/journals');
					});
					success();
				});
		});
	},
	getLocalJournals(patientId) {
		return new Promise((success) => {
				const storedJournals = localStorage.getItem('patient/'+patientId+'/local/journals');
				let journals = [];
				if(storedJournals !== null) {
					journals = JSON.parse(storedJournals);
				}
				success(journals);
		});
	},
	createLocalJournal(journal) {
		journal.id = uuid();
		journal.submittedAt = Date.now();
		return new Promise((success) => {
			const promise1 = this.getLocalJournals(journal.patientId).then((journals) => {
				journals.push(journal);
				localStorage.setItem('patient/'+journal.patientId+'/local/journals', JSON.stringify(journals));
			});
			const promise2 = this.createJournal(journal);
			Promise.all([promise1, promise2]).then(() => {
				success(journal);
			});
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
			this.getJournals(patientId).then((journals) => {
				journals.forEach((journal) => {
					localStorage.removeItem('patient/'+journal.patientId+'/journal/'+journal.id);
				});
				success();
			});
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
				return this.getPatient(patientId);
			});
			Promise.all(promises).then((patients) => {
					success(patients);
				});
		});
	},
	createLog(log) {
		log.id = uuid();
		log.readAt = Date.now();
		return new Promise((success) => {
			localStorage.setItem('log/' + log.id, JSON.stringify(log));
			success(log);
		});
	}
};

export default StoreService;