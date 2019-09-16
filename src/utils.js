const ProfanityFilter = require('bad-words');
const filter = new ProfanityFilter();

const generateGoogleMapsLink = ({ latitude, longitude }) => (
    `https://google.com/maps?q=${latitude},${longitude}`
);

const profanityTest = (message) => {
    return filter.isProfane(message);
};

module.exports = {
    generateGoogleMapsLink,
    profanityTest
};