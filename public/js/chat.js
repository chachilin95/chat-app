const socket = io();

const form = document.querySelector('#message-form');
const sendLocationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
    console.log('new message:', message);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    socket.emit('sendMessage', e.target.elements.message.value);
});

sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(({ coords }) => {
        socket.emit('sendLocation', {
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    });
});