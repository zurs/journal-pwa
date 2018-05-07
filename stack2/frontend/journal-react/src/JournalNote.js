import React, { Component } from 'react';
export default class JournalNote extends Component {
	constructor(props) {
		super(props);
		this.onShowNote = this.onShowNote.bind(this);
	}

	onShowNote() {
		this.props.onReadNote(this.props.journal.index);
	}


	shouldComponentUpdate(nextProps) {
		return nextProps.journal.text !== null;
	}

	render() {
		return (
			<div>
				<br/>
				<div className="well">
					{this.props.journal.submittedAt}
					{!this.props.journal.text && <button onClick={this.onShowNote} className="pull-right btn btn-sm btn-primary">Visa text</button>}
					{this.props.journal.text && <div><h5>Text</h5>{this.props.journal.text}</div>}
				</div>
			</div>
		);
	}
}