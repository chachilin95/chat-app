const socket = io();

const form = document.querySelector('#message-form');

socket.on('message', (message) => {
    console.log('new message:', message);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    socket.emit('sendMessage', e.target.elements.message.value);
});