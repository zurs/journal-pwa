import React, { Component } from 'react';
import PatientService from './services/PatientService';
import {Link} from "react-router-dom";

export default class PatientList extends Component {
	constructor(props) {
		super(props);
		this.patients = null;
	}

	componentDidMount() {
		PatientService.getPatients((jsonPatients) => {
			this.patients = jsonPatients.map((patient) => {
				return (
					<tr>
						<td>{patient.name}</td>
						<td>{patient.ssn}</td>
						<td><Link className={'btn btn-primary'} to={`/journals/${patient.id}`}>Läs Journal</Link></td>
					</tr>
				);});
			this.setState({});
		});
	}

	render() {
		return (
			<div className={'row'}>
				<div>
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
							{this.patients}
						</tbody>
					</table>
					<button class="btn btn-warning">Logga ut</button>
				</div>
			</div>);}
}