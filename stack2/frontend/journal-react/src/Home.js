import React, { Component } from 'react';
import Patients from './Patients';
import {Route, Switch} from "react-router-dom";
import Journals from "./Journals";

class Home extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<Switch>
				<Route exact path = "/" component={Patients}/>
				<Route path = "/patient/:number" component={Journals}/>
			</Switch>

		);
	}
}

export default Home;