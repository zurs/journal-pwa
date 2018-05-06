import React, { Component } from 'react';

export default class Journals extends Component {
	constructor(props) {
		super(props);
		this.patient = {name: "foo", ssn: "1999-xxxxx"};
	}

	render() {
		return (
			<div className="col-md-6 col-md-offset-3">
				<p>Namn: {this.patient.name}</p>
				<p>Personnummer: {this.patient.ssn}</p>
				<button className="btn btn-md btn-primary">
					<span>Ny anteckning</span>
				</button>
				<br/>
				<form>
					<div className='form-group'>
						<label for="new_journal_note">Anteckning:</label>
						<textarea name="text" id="new_journal_note" cols="30" rows="10" className="form-control"></textarea>
					</div>
					<button className="btn btn-success" type="submit">Lägg till & Signera</button>
				</form>
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