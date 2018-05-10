import axios from 'axios';

let subscribers = [];
export class Request {
	static create(baseUrl) {
		const instance = axios.create({
			baseURL: 'http://localhost/stack2/' + baseUrl,
			headers: {
				'Content-Type': 'application/json'
			}
		});
		instance.interceptors.response.use(null, (error) => {
			console.log(subscribers);
			subscribers.forEach((subscriber) => {
				subscriber();
			});
			return Promise.reject(error);
		});
		return instance;
	}
	static subscribe(callback) {
		subscribers.push(callback);
	}
}