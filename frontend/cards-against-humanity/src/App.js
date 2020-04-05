import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class App extends Component {
	state = { data: null };

	componentDidMount() {
		const endpoint = 'http://127.0.0.1:4001';
		const socket = socketIOClient(endpoint);
		socket.on('hello', (data) => this.setState({ data: data }));
	}

	render() {
		return (
			<div>
				hello worlds
				<div>{this.state.data}</div>
			</div>
		);
	}
}

export default App;
