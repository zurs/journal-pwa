const StoreService = {
	getJournal(journalId) {
		return new Promise((success, fail) => {
			const storedData = localStorage.getItem('journalId=' + journalId);
			if(storedData === null)
				fail();
			success(JSON.parse(storedData));
		});
	},
	getLocalJournals() {
		return new Promise((success) => {
			const storageKeys = Object.keys(localStorage).filter((key) => {
				const keySplit = key.split("=");
				return keySplit[0] === 'localJournalId';
			});
			const journals = storageKeys.map((key) => {
				const storedJournal = localStorage.getItem(key);
				return JSON.parse(storedJournal);
			});
			success(journals);
		});
	},
	createLocalJournal(journal) {
		return new Promise((success) => {
			localStorage.setItem('localJournalId='+journal.id, JSON.stringify(journal));
			success();
		});
	},
	createJournal(journal) {
		return new Promise((success) => {
			localStorage.setItem('journalId='+journal.id, JSON.stringify(journal));
			success();
		});
	},
	createPatient(patient) {
		return new Promise((success) => {
			patient.offline = true;
			localStorage.setItem('patientId=' + patient.id, JSON.stringify(patient));
			success();
		});
	},
	getPatient(patientId) {
		return new Promise((success, fail) => {
			const storedData = localStorage.getItem('patientId=' + patientId);
			if(storedData === null)
				fail();
			success(JSON.parse(storedData));
		});
	},
	deletePatient(patientId) {
		return new Promise((success) => {
			localStorage.removeItem('patientId=' + patientId);
			success();
		});
	},
	getPatients() {
		return new Promise((success) => {
			const patientIds = Object.keys(localStorage).filter((key) => {
					const keySplit = key.split("=");
					return keySplit[0] === 'patientId';
				}).map((key) => {
					const keySplit = key.split("=");
					return keySplit[1];
				});

			const promises = patientIds.map((patientId) => {
				return this.getPatient(patientId).then((patient) => {
					return patient
				});
			});

			Promise.all(promises).then((patients) => {
					success(patients);
				});
		});
	}
};

export default StoreService;