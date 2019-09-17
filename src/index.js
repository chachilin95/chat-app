const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { setupSocketActions } = require('./utils/socket');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicDir));

const server = http.createServer(app);

const io = socketio(server);
setupSocketActions(io);

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});