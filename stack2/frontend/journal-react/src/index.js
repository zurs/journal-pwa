import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import NetworkService from "./services/NetworkService";

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
NetworkService.initNetworkCheck(1000);
