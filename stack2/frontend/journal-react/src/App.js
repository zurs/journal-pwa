import React, {Component} from 'react';
import Routes from './Routes';

import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="container">
				<Router>
					<Route path="/" component={Routes}/>
				</Router>
			</div>
		);
	}
}

export default App;
