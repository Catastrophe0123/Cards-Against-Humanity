const express = require('express');
const http = require('http');
const app = express();
const socketIo = require('socket.io');
const axios = require('axios').default;
const redis = require('redis');
const client = redis.createClient();
const uuid = require('uuid/v4');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// new stuff
io.on('connection', (socket) => {
	console.log('new user connected : ', socket.id);
	socket.on('REGISTER_USER', (username) => {
		// check if the username is in redis
		if (socket.user) {
			return socket.emit('ALREADY_REGISTERED', socket.user);
		}
		// not registered so register
		console.log(socket.user);
		client.exists(username, function (err, reply) {
			if (reply === 1) {
				// exists
				console.log('hello ');
				return socket.emit('USERNAME_EXISTS');
			} else {
				console.log('hellaosdi');
				client.set(username, socket.id, function (err, reply) {
					if (err) return console.err(err);
					socket.user = { username };
					socket.emit('REGISTER_SUCCESS');
				});
			}
		});
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected : ', socket.id);
		if (socket.user) {
			username = socket.user.username;
		}
		client.del(socket.id, function (err, reply) {
			// returns a number
			if (err) return console.error(err);
		});
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
