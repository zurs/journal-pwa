import React, { Component } from 'react';
import PatientList from './PatientList';
import {Route, Switch} from "react-router-dom";
import Journals from "./Journals";

class Home extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<Switch>
				<Route path = "/home" component={PatientList}/>
				<Route path = "/journals/:number" component={Journals}/>
			</Switch>

		);
	}
}

export default Home;