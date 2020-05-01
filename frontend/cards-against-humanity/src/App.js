import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Rooms from './components/Rooms';

const endpoint = 'http://127.0.0.1:4001';
const socket = socketIOClient(endpoint);

class App extends Component {
	state = { username: null };

	setUser = (username) => {
		this.setState({ username });
	};

	componentDidMount = () => {
		let username = localStorage.getItem('username');
		if (username) {
			this.setUser(username);
			socket.user = { username };
		}
	};

	componentWillUnmount() {}

	render() {
		return (
			<Router>
				<Switch>
					<Route
						exact
						path='/'
						component={(props) => (
							<Home
								setUser={this.setUser}
								username={this.state.username}
								{...props}
							/>
						)}
					/>
					<Route
						exact
						path='/rooms'
						component={(props) => (
							<Rooms
								{...props}
								username={this.state.username}
								socket={socket}
								endpoint={endpoint}
							/>
						)}
					/>
				</Switch>
			</Router>
		);
	}
}

export { App, socket };
