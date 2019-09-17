const { addUser, removeUser, getUser } = require('./users');
const { generateLocationMessage, generateTextMessage } = require('./messages');
const { profanityTest } = require('./filters');

const setupSocketActions = (io) => {
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
};

module.exports = {
    setupSocketActions
};