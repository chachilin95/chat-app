const ProfanityFilter = require('bad-words');

const generateGoogleMapsLink = ({ latitude, longitude }) => (
    `https://google.com/maps?q=${latitude},${longitude}`
);

const profanityTest = (message) => {
    const filter = new ProfanityFilter();
    return filter.isProfane(message);
};

module.exports = {
    generateGoogleMapsLink,
    profanityTest
};