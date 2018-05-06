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
			isAuthenticated: false
		};
		AccountService.authenticationState.subscribe((newState) => {
			console.log('Is authenticated');
			this.setState({
				isAuthenticated: newState
			});
		});
	}

	render() {
		let currentComponent = (<Home/>);
		if(!this.state.isAuthenticated){
			currentComponent = (<LoginFormWithRouter/>);
		}
		return (
			<div className="container">
				<Router>
					<div className={'row'}>
						{currentComponent}
					</div>
				</Router>
			</div>
		);
	}
}

export default App;
