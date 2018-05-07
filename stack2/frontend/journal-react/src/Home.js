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
				<Route exact path = "/" component={PatientList}/>
				<Route path = "/patient/:number" component={Journals}/>
			</Switch>

		);
	}
}

export default Home;