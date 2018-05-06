import React, { Component } from 'react';
import JournalNote from "./JournalNote";

export default class Journals extends Component {
	constructor(props) {
		super(props);
		this.patient = {name: "foo", ssn: "1999-xxxxx"};
		this.onToggleNote = this.onToggleNote.bind(this);
		this.state = {showNote: false};
	}

	onNewNote(note) {
		console.log(note);
	}

	onToggleNote() {
		this.setState({showNote: !this.state.showNote});
	}

	render() {
		return (
			<div className="col-md-6 col-md-offset-3">
				<p>Namn: {this.patient.name}</p>
				<p>Personnummer: {this.patient.ssn}</p>
				<button className="btn btn-md btn-primary" onClick={this.onToggleNote}>
					<span>{this.state.showNote ? "Stäng anteckning" : "Ny anteckning"}</span>
				</button>
				<br/>
				{this.state.showNote && <JournalNote onNewNote={this.onNewNote}/>}
				<br/>
				<div className="well">
					Skriven: dasda
					<button className="pull-right btn btn-sm btn-primary">Visa text</button>
					<h5>Text:</h5>
					<p>Foobar</p>
				</div>
			</div>);
	}
}