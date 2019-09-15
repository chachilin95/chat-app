const socket = io();

socket.on('message', (message) => {
    console.log('new message:', message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.message.value;
    const acknowledgment = (error) => {
        if (error) {
            return console.log(error);
        }
        console.log('message delivered!');
    };

    socket.emit('sendMessage', message, acknowledgment);
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(({ coords }) => {

        const coordinates = {
            latitude: coords.latitude,
            longitude: coords.longitude
        };

        const acknowledgment = (message) => {
            console.log(message);
        };

        socket.emit('sendLocation', coordinates, acknowledgment);
    });
});