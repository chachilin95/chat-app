const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { addUser, removeUser } = require('./utils/users');
const { generateLocationMessage, generateTextMessage } = require('./utils/messages');
const { profanityTest } = require('./utils/filters');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicDir));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateTextMessage('Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateTextMessage(`${user.username} has joined!`));

        callback();
    });

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
        const removedUser = removeUser(socket.id);
        console.log('remove:', removedUser);

        if (removedUser) {
            io.to(removedUser.room).emit('message', generateTextMessage(`${removedUser.username} has left the room.`));
        }
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});