import React, { Component } from 'react';
import AccountService from './services/AccountService';

export default class LoginForm extends Component {

	constructor(props){
		super(props);
		this.state = {
			username: '',
			password: ''
		};
		this.loginSubmit    = this.loginSubmit.bind(this);
		this.usernameChange = this.usernameChange.bind(this);
		this.passwordChange = this.passwordChange.bind(this);
		//console.log(this.props);
	}

	loginSubmit(e){
		e.preventDefault();
		let username = this.state.username;
		let password = this.state.password;
		AccountService.authenticate(username, password, () => {
			this.props.history.push('/home');
		});

	}

	usernameChange(e){
		this.setState({
			username: e.target.value
		});
	}

	passwordChange(e){
		this.setState({
			password: e.target.value
		});
	}

	render(){
		let headerStyle = {textAlign: 'center'};

		return (
			<div className="col-md-6 col-md-offset-3">
				<h2 style={headerStyle}>Welcome to Journaling</h2>
				<form onSubmit={this.loginSubmit}>
					<div className="form-group">
						<label htmlFor="login_form_username_input">Användarnamn: </label>
						<input type="text" className="form-control" id="login_form_username_input" value={this.state.username} onChange={this.usernameChange}/>
					</div>
					<div>
						<label htmlFor="login_form_password_input">Användarnamn: </label>
						<input type="password" className="form-control" id="login_form_password_input" value={this.state.password} onChange={this.passwordChange}/>
					</div>
					<br/>
					<button type="submit" className="btn btn-success">Logga in</button>
				</form>
			</div>
		);
	}

}