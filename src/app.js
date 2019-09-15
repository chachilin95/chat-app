const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDir));

io.on('connection', (socket) => {
    socket.emit('message', 'Welcome!');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });
});

module.exports = {
    app,
    port,
    server
};