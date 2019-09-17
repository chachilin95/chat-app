const generateGoogleMapsLink = ({ latitude, longitude }) => (
    `https://google.com/maps?q=${latitude},${longitude}`
);

const generateLocationMessage = (username, coordinates) => ({
    username,
    url: generateGoogleMapsLink(coordinates),
    createdAt: new Date().getTime()
});

const generateTextMessage = (username, text) => ({
    username,
    text,
    createdAt: new Date().getTime()
});

module.exports = {
    generateGoogleMapsLink,
    generateLocationMessage,
    generateTextMessage
};