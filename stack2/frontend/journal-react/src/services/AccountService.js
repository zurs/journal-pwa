import axios from 'axios';


const Request = axios.create({
	baseURL: 'http://localhost/stack2/account',
	headers: {
		'Content-Type': 'application/json'
	}
});

let apiKey = null;
const AccountService = {
	login(username, password) {
		return new Promise((success, fail) => {
			Request.post('/login', {username: username, password: password})
				.then((response) => {
					apiKey = response.data.apiKey;
					localStorage.setItem('apiKey', apiKey);
					success();
			}).catch(() => {
				fail("failed");
			});
		});
	},
	getApiKey() {
		if(apiKey === null) {
			apiKey = localStorage.getItem('apiKey');
		}
		return apiKey;
	},
	logout() {
		apiKey = null;
		localStorage.removeItem('apiKey');
	}
};

export default AccountService;