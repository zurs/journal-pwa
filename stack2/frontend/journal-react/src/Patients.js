import React, { Component } from 'react';
import PatientService from './services/PatientService';
import {Link} from "react-router-dom";
import AccountService from "./services/AccountService";

const PatientRows = (props) => {
	return props.patients.map((patient) => {
		return (
			<tr>
				<td>{patient.name}</td>
				<td>{patient.ssn}</td>
				<td><Link className={'btn btn-primary'} to={`/patient/${patient.id}`}>Läs Journal</Link></td>
				<td>
					{patient.offline && <button className={'btn btn-danger'}>Ta bort lokaldata</button>}
					{!patient.offline && <button className={'btn btn-primary'}>Spara lokalt</button>}
				</td>
			</tr>
		);});
};

export default class Patients extends Component {
	constructor(props) {
		super(props);
		this.state = {
			patients : [],
		};
		this.onLogout = this.onLogout.bind(this);
	}

	componentDidMount() {
		PatientService.getPatients()
			.then((patients) => {
				this.setState({patients: patients});
			});
	}

	onLogout() {
		AccountService.logout();
		this.props.history.push('/login');
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
				<button class="btn btn-warning" onClick={this.onLogout}>Logga ut</button>
		</div>);}
}