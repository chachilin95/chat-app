const ProfanityFilter = require('bad-words');
const filter = new ProfanityFilter();

const profanityTest = (message) => {
    return filter.isProfane(message);
};

module.exports = {
    profanityTest
};