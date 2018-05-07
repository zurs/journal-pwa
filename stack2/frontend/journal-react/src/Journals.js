import React, { Component } from 'react';
import NewJournalNote from "./NewJournalNote";
import JournalNote from "./JournalNote";
import PatientService from "./services/PatientService";

const JournalList = (props) => {
	return props.journals.map((journal, index) => {
		return (<JournalNote onReadNote={props.onReadNote} journal={Object.assign({index: index}, journal)}/>);
	});
};

export default class Journals extends Component {
	constructor(props) {
		super(props);
		this.patientId = this.props.match.params.number;
		this.state = {
			patient: {name: "", ssn: ""},
			journals: [],
			showNewNote: false
		};

		this.onToggleNewNote = this.onToggleNewNote.bind(this);
		this.onNewNote = this.onNewNote.bind(this);
		this.onReadNote = this.onReadNote.bind(this);
	}

	componentDidMount() {
		Promise.all([PatientService.getPatient(this.patientId), PatientService.getJournals(this.patientId)])
			.then((result) => {
				this.setState({
					patient: result[0],
					journals: result[1]
				});
			});
	}

	onReadNote(index) {
		let newJournals = this.state.journals.map((journal, i) => {
			if(index === i) {
				return Object.assign({}, journal);
			}
			return journal;
		});
		this.setState({journals :  newJournals});
	}

	onNewNote(note) {
		let currentJournals = this.state.journals;
		currentJournals.push({id:"ddd", submittedAt: "2018-19-19", text: note});
		this.setState({journals: currentJournals, showNewNote: false});
	}

	onToggleNewNote() {
		this.setState({showNewNote: !this.state.showNewNote});
	}

	render() {
		return (
			<div className="col-md-6 col-md-offset-3">
				<p>Namn: {this.state.patient.name}</p>
				<p>Personnummer: {this.state.patient.ssn}</p>
				<button className="btn btn-md btn-primary" onClick={this.onToggleNewNote}>
					<span>{this.state.showNewNote ? "Stäng anteckning" : "Ny anteckning"}</span>
				</button>
				<br/>
				{this.state.showNewNote && <NewJournalNote onNewNote={this.onNewNote}/>}
				<br/>
				<JournalList journals={this.state.journals} onReadNote={this.onReadNote}/>
			</div>);
	}
}
