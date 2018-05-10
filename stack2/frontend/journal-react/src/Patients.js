import React, { Component } from 'react';
import PatientService from './services/PatientService';
import {Link} from "react-router-dom";
import AccountService from "./services/AccountService";
import StoreService from "./services/StoreService";

const PatientRows = (props) => {
	return props.patients.map((patient) => {
		return (
			<tr>
				<td>{patient.name}</td>
				<td>{patient.ssn}</td>
				<td><Link className={'btn btn-primary'} to={`/patient/${patient.id}`}>Läs Journal</Link></td>
				<td>
					{patient.offline && <button className={'btn btn-danger'} onClick={() => {props.onLocalRemove(patient)}}>Ta bort lokaldata</button>}
					{!patient.offline && <button className={'btn btn-primary'} onClick={() => {props.onLocalStore(patient)}}>Spara lokalt</button>}
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
		this.onLogout 		= this.onLogout.bind(this);
		this.onLocalRemove 	= this.onLocalRemove.bind(this);
		this.onLocalStore 	= this.onLocalStore.bind(this);
	}

	componentDidMount() {
		PatientService.getPatients()
			.then((patients) => {
				this.setState({
					patients: patients
				});
			});
	}

	onLogout() {
		AccountService.logout();
		this.props.history.push('/login');
	}

	onLocalRemove(storedPatient) {
		StoreService.deletePatient(storedPatient.id);
		const newPatients = this.state.patients.map((patient) => {
			if(patient.id === storedPatient.id) {
				let newPatient = Object.assign({}, storedPatient);
				newPatient.offline = false;
				return newPatient;
			}
			return patient;
		});
		this.setState({patients: newPatients});
	}

	onLocalStore(storedPatient) {
		StoreService.createPatient(storedPatient)
			.then(() => {
				const newPatients = this.state.patients.map((patient) => {
					if(patient.id === storedPatient.id) {
						return Object.assign({}, storedPatient);
					}
					return patient;
				});
				this.setState({
					patients: newPatients
				});
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
						<PatientRows patients={this.state.patients} onLocalRemove={this.onLocalRemove} onLocalStore={this.onLocalStore}/>
					</tbody>
				</table>
				<button class="btn btn-warning" onClick={this.onLogout}>Logga ut</button>
		</div>);}
}