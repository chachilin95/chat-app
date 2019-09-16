const generateGoogleMapsLink = ({ latitude, longitude }) => (
    `https://google.com/maps?q=${latitude},${longitude}`
);

const generateLocationMessage = (coordinates) => ({
    url: generateGoogleMapsLink(coordinates),
    createdAt: new Date().getTime()
});

const generateTextMessage = (text) => ({
    text,
    createdAt: new Date().getTime()
});

module.exports = {
    generateGoogleMapsLink,
    generateLocationMessage,
    generateTextMessage
};