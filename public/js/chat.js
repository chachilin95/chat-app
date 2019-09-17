const socket = io();

// elements
const $messages = document.querySelector('#messages');
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML;

// options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', (message) => {
    const data = {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    };

    const html = Mustache.render(messageTemplate, data);
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
    const data = {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    };

    const html = Mustache.render(locationMessageTemplate, data);
    $messages.insertAdjacentHTML('beforeend', html);
});

// message form
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // disable element
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;
    const acknowledgment = (error) => {

        // re-enable elements
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('message delivered!');
    };

    socket.emit('sendMessage', message, acknowledgment);
});

// send location button
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser');
    }

    // disable element
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(({ coords }) => {

        const coordinates = {
            latitude: coords.latitude,
            longitude: coords.longitude
        };

        const acknowledgment = (message) => {
            // re-enable element
            $sendLocationButton.removeAttribute('disabled');

            console.log(message);
        };

        socket.emit('sendLocation', coordinates, acknowledgment);
    });
});

// attempt to join chat room
socket.emit('join', { username, room });