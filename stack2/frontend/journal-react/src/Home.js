import React, { Component } from 'react';
import PatientList from './PatientList';

class Home extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<PatientList/>
		);
	}
}

export default Home;