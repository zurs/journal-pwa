import axios from 'axios';

const AccountService = {

	URL: 'http://localhost/stack2',
	apiKey: null,
	instance: axios.create({
		baseURL: this.URL,
		headers: {
			'Content-Type': 'application/json'
		}
	}),
	authenticationState: {
		subscribers: [],
		subscribe(fun){
			this.subscribers.push(fun);
		},
		updateState(newState){
			this.subscribers.forEach((item) => {
				item(newState);
			});
		}
	},

	authenticate(username, password, onSuccess){
		let url = this.URL + '/account/login';
		this.instance.post(url, {
			username: username,
			password: password
		}).then(response => {
				this.apiKey = response.data.apiKey;
				onSuccess();
				this.authenticationState.updateState(true);
		}).catch(error => {
			console.log(error);
		});
	},
};

export default AccountService;