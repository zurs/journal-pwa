import axios from 'axios';

const Request = axios.create({
	baseURL: 'http://localhost/stack2/patient/',
	headers: {
		'Content-Type': 'application/json'
	}
});

const PatientService = {
	getPatients(callback) {
		return Request.get('').then((response) => {
			callback(response.data)
		});
	}
};

export default PatientService;