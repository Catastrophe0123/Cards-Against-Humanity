import React, { Component } from 'react';

// display the rooms
class Rooms extends Component {
	componentDidMount = () => {
		// listen to events

		console.log(this.props);
		if (!this.props.username) {
			this.props.history.push('/');
		}

		this.props.socket.on('ROOM_NAME', function (roomName) {
			console.log(roomName);
		});
	};

	onClickHandler = () => {
		let { socket } = this.props;

		// create a new room
		socket.emit('CREATE_ROOM', this.props.username);
	};

	render() {
		return (
			<div>
				<h1>JOIN OR CREATE A ROOM</h1>
				<button onClick={this.onClickHandler}>CREATE A NEW ROOM</button>
			</div>
		);
	}
}

export default Rooms;
