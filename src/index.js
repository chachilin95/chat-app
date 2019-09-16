const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { generateLocationMessage, generateTextMessage } = require('./utils/messages');
const { profanityTest } = require('./utils/filters');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDir));

io.on('connection', (socket) => {    
    socket.emit('message', generateTextMessage('Welcome!'));
    socket.broadcast.emit('message', generateTextMessage('A new user has joined!'));

    // emit text message
    socket.on('sendMessage', (message, callback) => {

        if (profanityTest(message)) {
            return callback('Profanity is not allowed...');
        }

        io.emit('message', generateTextMessage(message));
        callback();
    });

    // emit location
    socket.on('sendLocation', (coordinates, callback) => {
        io.emit('locationMessage', generateLocationMessage(coordinates));
        callback('location shared!');
    });

    // emit disconnect message
    socket.on('disconnect', () => {
        io.emit('message', generateTextMessage('A user has left.'));
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});