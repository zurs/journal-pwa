import React, { Component } from 'react';
import NewJournalNote from "./NewJournalNote";
import JournalNote from "./JournalNote";

const JournalList = (props) => {
	return props.journals.map((journal, index) => {
		return (<JournalNote onReadNote={props.onReadNote} journal={Object.assign({index: index}, journal)}/>);
	});
};

export default class Journals extends Component {
	constructor(props) {
		super(props);
		this.state = {
			patient: {name: "foo", ssn: "1999-xxxxx"},
			journals: [{id: "32asd", submittedAt: "2018-12-12", text: null}],
			showNewNote: false
		};
		this.onToggleNewNote = this.onToggleNewNote.bind(this);
		this.onNewNote = this.onNewNote.bind(this);
		this.onReadNote = this.onReadNote.bind(this);
	}

	onReadNote(index) {
		let newJournals = this.state.journals.map((journal, i) => {
			if(index === i) {
				journal.text = "foo";
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
