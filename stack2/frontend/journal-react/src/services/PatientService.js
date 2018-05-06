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
	}
};

export default PatientService;