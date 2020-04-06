import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

const endpoint = 'http://127.0.0.1:4001';
const socket = socketIOClient(endpoint);

class App extends Component {
	state = { data: null, username: '', errors: null };

	componentDidMount() {
		socket.emit('newGame');
		socket.on('sets', (data) => console.log(data));
		socket.on('connect', function () {
			console.log('id : ', socket.id);
		});
		socket.on('USERNAME_EXISTS', () => {
			this.setState({ errors: 'username currently in use' });
		});

		socket.on('ALREADY_REGISTERED', () => {
			this.setState({ errors: 'user already registered' });
			// TODO : redirect to rooms page
		});

		socket.on('REGISTER_SUCCESS', () => {
			this.setState({ errors: null });
			// TODO : redirect to rooms page
		});
	}

	onChangeHandler = (event) => {
		this.setState({
			username: event.target.value,
		});
	};

	onSubmitHandler = () => {
		socket.emit('registerUser', this.state.username);
	};

	render() {
		return (
			<div>
				<h1>WELCOME TO CARDS AGAINST HUMANITY</h1>
				<br />
				<label htmlFor='name'>
					PLEASE ENTER A UNIQUE USERNAME :{' '}
					<input
						value={this.state.username}
						onChange={this.onChangeHandler}
						type='text'
						name='name'
						placeholder='Enter a username'
					/>
				</label>{' '}
				<button onClick={this.onSubmitHandler}>SUBMIT</button>
				{this.state.errors ? <p>{this.state.errors}</p> : null}
			</div>
		);
	}
}

export default App;
