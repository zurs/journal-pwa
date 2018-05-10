import {Request as RequestUtil} from "../util/Request";
const Request = RequestUtil.create('account');

let apiKey = null;
const AccountService = {
	login(username, password) {
		return new Promise((success, fail) => {
			Request.post('/login', {username: username, password: password})
				.then((response) => {
					apiKey = response.data.apiKey;
					localStorage.setItem('apiKey', apiKey);
					success();
			})
			.catch(() => {
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
		localStorage.clear();
	}
};

export default AccountService;