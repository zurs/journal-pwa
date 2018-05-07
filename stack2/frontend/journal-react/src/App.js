import React, {Component} from 'react';
import LoginForm from './LoginForm';
import Home from './Home';

import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
import AccountService from './services/AccountService';
const LoginFormWithRouter = withRouter(LoginForm);
class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			isAuthenticated: AccountService.getApiKey() !== null
		};
		this.onLogin = this.onLogin.bind(this);
	}

	onLogin(username, password) {
		AccountService.login(username, password)
			.then(() => {
				this.setState({
					isAuthenticated: true
				});
			});
	}

	render() {
		return (
			<div className="container">
				<Router>
					<div className={'row'}>
						{this.state.isAuthenticated ? <Home/> : <LoginFormWithRouter onLogin={this.onLogin}/>}
					</div>
				</Router>
			</div>
		);
	}
}

export default App;
