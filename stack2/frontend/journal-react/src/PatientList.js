import React, { Component } from 'react';
import PatientService from './services/PatientService';
import {Link} from "react-router-dom";

const PatientRows = (props) => {
	return props.patients.map((patient) => {
		return (
			<tr>
				<td>{patient.name}</td>
				<td>{patient.ssn}</td>
				<td><Link className={'btn btn-primary'} to={`/journals/${patient.id}`}>Läs Journal</Link></td>
			</tr>
		);});
};

export default class PatientList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			patients : []
		};
	}

	componentDidMount() {
		PatientService.getPatients()
			.then((patients) => {
				this.setState({patients: patients});
			});
	}

	render() {
		return (
			<div className="col-md-6 col-md-offset-3">
				<h3>Patienter:</h3>
				<table className="table">
					<thead>
					<tr>
						<th>Patient</th>
						<th>Personnummer</th>
						<th>Åtgärd</th>
					</tr>
					</thead>
					<tbody>
						<PatientRows patients={this.state.patients}/>
					</tbody>
				</table>
				<button class="btn btn-warning">Logga ut</button>
		</div>);}
}