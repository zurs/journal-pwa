import StoreService from "./StoreService";
import {Request as RequestUtil} from "../util/Request";
const Request = RequestUtil.create('');
let requestInterval;
let networkCheck = null;
const NetworkService = {
	initNetworkCheck(interval) {
		requestInterval = interval;
		RequestUtil.subscribe(() => {
			this.startCheckingNetwork();
		});
		window.addEventListener('online', () => {
			StoreService.syncStorage();
			this.stopCheckingNetwork();
		});
	},
	startCheckingNetwork() {
		if(networkCheck === null) {
			networkCheck = setInterval(() => {
				Request.get('/')
					.then(() => {
						StoreService.syncStorage();
						this.stopCheckingNetwork();
					});
			}, requestInterval);
		}
	},
	stopCheckingNetwork() {
		if(networkCheck !== null) {
			clearInterval(networkCheck);
			networkCheck = null;
		}
	}
};

export default NetworkService;