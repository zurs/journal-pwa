import React, { Component } from 'react';
import Patients from './Patients';
import Login from './Login';
import {Redirect, Route, Switch} from "react-router-dom";
import Journals from "./Journals";
import AccountService from "./services/AccountService";

class Routes extends Component {
	constructor(props){
		super(props);

	}

	componentDidMount() {
		if(AccountService.getApiKey() === null) {
			this.props.history.replace('/login');
		}
	}


	render() {
		return (
			<Switch>
				<Route path = "/login" component={Login}/>
				<Redirect exact from='/' to ="/home" />
				<Route path = "/home" component={Patients}/>
				<Route path = "/patient/:number" component={Journals}/>
			</Switch>

		);
	}
}

export default Routes;