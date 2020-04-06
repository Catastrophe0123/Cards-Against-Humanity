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

const io = socketIo(server);

io.on('connection', (socket) => {
	console.log('new client connected : ', socket.id);

	socket.on('registerUser', (username) => {
		client.exists(username, function (err, reply) {
			if (err) {
				console.error(err);
			} else {
				// 1 if exists
				// 0 if not

				client.exists(socket.id, function (err, reply1) {
					if (err) {
						console.error(err);
					} else {
						if (reply1 === 1) {
							socket.emit('ALREADY_REGISTERED');
							return;
						} else {
							if (reply === 1) {
								socket.emit('USERNAME_EXISTS');
							} else {
								client.set(socket.id, username);
								client.set(username, socket.id);
								socket.emit('REGISTER_SUCCESS');
							}
						}
					}
				});
			}
		});

		// client.set(username, socket.id);

		// HOLUP

		// REMOVING VALUES
		// client.srem('users', 'nava', function (err, reply) {
		// 	if (err) {
		// 		console.error(err);
		// 	} else {
		// 		console.log('removed nava : ', reply);
		// 	}
		// });
	});

	socket.on('newGame', async () => {
		let response = await axios.get(
			'https://cards-against-humanity-api.herokuapp.com/sets/Base'
		);
		socket.emit('sets', response.data);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected : ', socket.id);
		// TODO: remove user from redis
		let username = '';
		client.get(socket.id, function (err, reply) {
			if (err) {
				console.error(err);
			} else {
				console.log(reply);
				username = reply;
				if (reply === null) return;
				client.del(username, function (err, reply) {
					if (err) {
						console.error(err);
					} else {
					}
				});
			}
		});
		client.del(socket.id, function (err, reply) {
			if (err) {
				console.error(err);
			} else {
			}
		});
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
