import React, { Component } from 'react';
import NewJournalNote from "./NewJournalNote";
import JournalNote from "./JournalNote";
import PatientService from "./services/PatientService";
import JournalService from "./services/JournalService";

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
			patient: {
				name: "",
				ssn: ""
			},
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
				console.log(result[1]);
				this.setState({
					patient: result[0],
					journals: result[1]
				});
			});
	}

	onReadNote(index) {
		let currentJournals = this.state.journals;
		const journalId = currentJournals[index].id;
		JournalService.getJournal(journalId)
			.then((journal) => {
				currentJournals[index] = journal;
				this.setState({
					journals: currentJournals
				})
			});
	}

	onNewNote(note) {
		JournalService.createJournal({
			text: note,
			writtenAt: Date.now(),
			patientId:
			this.patientId
		})
			.then((newJournal) => {
				let currentJournals = this.state.journals;
				currentJournals.push(newJournal);
				this.setState({
					journals: currentJournals,
					showNewNote: false
				});
			});
	}

	onToggleNewNote() {
		this.setState({
			showNewNote: !this.state.showNewNote
		});
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
