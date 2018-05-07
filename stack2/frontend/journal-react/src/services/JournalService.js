import axios from 'axios';

const Request = axios.create({
	baseURL: 'http://localhost/stack2/journal',
	headers: {
		'Content-Type': 'application/json'
	}
});