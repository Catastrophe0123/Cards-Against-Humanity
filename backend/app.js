const express = require('express');
const http = require('http');
const app = express();
const socketIo = require('socket.io');
const axios = require('axios').default;
const redis = require('redis');
const client = redis.createClient();

client.on('error', function (error) {
	console.error(error);
});

client.on('connect', function () {
	console.log('redis connected');
});

const port = process.env.PORT || 4001;

const server = http.createServer(app);

app.get('/', (req, res) => {
	res.send({ response: 'I am alive' }).status(200);
});

const io = socketIo(server); // < Interesting!

io.on('connection', (socket) => {
	// here you can start emitting events to the client
	console.log('new client connected');

	socket.on('registerUser', (username) => {
		console.log(username);
		client.sadd(['users', username], function (err, reply) {
			if (err) {
				console.log(err);
			} else {
				console.log('redis thithg : ', reply);
				// 1 if inserted successfully
				// 0 if duplicate value
				if (reply === 0) {
					socket.emit('USERNAME_EXISTS');
				} else {
					socket.emit('REGISTER_SUCCESS');
				}
			}
		});

		// REMOVING VALUES
		// client.srem('users', 'nava', function (err, reply) {
		// 	if (err) {
		// 		console.error(err);
		// 	} else {
		// 		console.log('removed nava : ', reply);
		// 	}
		// });

		// FETCHING VALUES
		client.smembers('users', function (err, reply) {
			if (err) {
				console.error(err);
			} else {
				console.log('all values stored in this : ', reply);
			}
		});
	});

	socket.on('newGame', async () => {
		let response = await axios.get(
			'https://cards-against-humanity-api.herokuapp.com/sets/Base'
		);
		socket.emit('sets', response.data);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
