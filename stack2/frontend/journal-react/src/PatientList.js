import React, { Component } from 'react';
import PatientService from 'services/PatientService';

export default class PatientList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="row">
				<div className="col-md-6 col-md-offset-3">
					<h1>Patients are listed here</h1>
				</div>
			</div>
		);
	}
}