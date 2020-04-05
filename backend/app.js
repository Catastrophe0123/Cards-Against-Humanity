const express = require('express');
const http = require('http');
// const axios = require('axios');
const app = express();
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;

const server = http.createServer(app);

app.get('/', (req, res) => {
	res.send({ response: 'I am alive' }).status(200);
});

const io = socketIo(server); // < Interesting!

io.on('connection', (socket) => {
	// here you can start emitting events to the client
	console.log('new client connected');

	socket.emit('hello', 'hello world');

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
