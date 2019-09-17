const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { addUser, removeUser, getUser } = require('./utils/users');
const { generateLocationMessage, generateTextMessage } = require('./utils/messages');
const { profanityTest } = require('./utils/filters');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicDir));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    const id = socket.id;

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateTextMessage('system', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateTextMessage('system', `${user.username} has joined!`));

        callback();
    });

    // emit text message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(id);

        if (profanityTest(message)) {
            return callback('Profanity is not allowed...');
        }

        io.to(user.room).emit('message', generateTextMessage(user.username, message));
        callback();
    });

    // emit location
    socket.on('sendLocation', (coordinates, callback) => {
        const user = getUser(id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, coordinates));
        callback();
    });

    // emit disconnect message
    socket.on('disconnect', () => {
        const removedUser = removeUser(id);
        console.log('remove:', removedUser);

        if (removedUser) {
            io.to(removedUser.room).emit('message', generateTextMessage('system', `${removedUser.username} has left the room.`));
        }
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});