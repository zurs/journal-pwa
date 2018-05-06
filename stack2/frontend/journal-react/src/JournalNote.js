import React, { Component } from 'react';
export default class JournalNote extends Component {
	constructor(props) {
		super(props);
		this.onNoteChange = this.onNoteChange.bind(this);
		this.onSubmit     = this.onSubmit.bind(this);
	}

	onNoteChange(e) {
		this.note = e.target.value;
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.onNewNote(this.note);
	}
	render() {
		return (
			<form onSubmit={this.onSubmit}>
				<div className='form-group'>
					<label for="new_journal_note">Anteckning:</label>
					<textarea name="text" id="new_journal_note" cols="30" rows="10" className="form-control" onChange={this.onNoteChange}></textarea>
				</div>
				<button className="btn btn-success" type="submit">Lägg till & Signera</button>
			</form>
		);
	}
}