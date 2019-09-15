const generateGoogleMapsLink = ({ latitude, longitude }) => (
    `https://google.com/maps?q=${latitude},${longitude}`
);

module.exports = {
    generateGoogleMapsLink
};