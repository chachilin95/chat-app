const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const util = require('./utils');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDir));

io.on('connection', (socket) => {    
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined!');

    socket.on('sendMessage', (message, callback) => {

        if (util.profanityTest(message)) {
            return callback('Profanity is not allowed...');
        }

        io.emit('message', message);
        callback();
    });

    socket.on('sendLocation', (coordinates, callback) => {
        io.emit('message', util.generateGoogleMapsLink(coordinates));
        callback('location shared!');
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left.');
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});