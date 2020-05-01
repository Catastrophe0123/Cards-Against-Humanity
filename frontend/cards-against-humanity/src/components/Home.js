import React, { Component } from 'react';
import { socket } from '../App';
import axios from 'axios';

export class Home extends Component {
	state = { data: null, username: '', errors: null };

	componentDidMount() {
		if (this.props.username) {
			this.props.history.push('/rooms');
		}

		// socket.emit('newGame');
		// socket.on('sets', (data) => console.log(data));
		socket.on('connect', function () {
			console.log('id : ', socket.id);
		});
		socket.on('USERNAME_EXISTS', () => {
			console.log('hello');
			this.setState({ errors: 'username currently in use' });
		});
		socket.on('ALREADY_REGISTERED', () => {
			console.log('hello');
			this.setState({ errors: 'user already registered' });
			// TODO : redirect to rooms page
		});
		socket.on('REGISTER_SUCCESS', () => {
			console.log('hello');
			this.setState({ errors: null });
			this.props.setUser(this.state.username);
			localStorage.setItem('username', this.state.username);
			this.props.history.push('/rooms');
		});
	}

	componentWillUnmount() {
		socket.off('connect');
		socket.off('USERNAME_EXISTS');
		socket.off('ALREADY_REGISTERED');
		socket.off('REGISTER_SUCCESS');
	}

	onChangeHandler = (event) => {
		this.setState({
			username: event.target.value,
		});
	};

	onSubmitHandler = () => {
		socket.emit('REGISTER_USER', this.state.username);
	};

	render() {
		return (
			<div>
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
			</div>
		);
	}
}

export default Home;
