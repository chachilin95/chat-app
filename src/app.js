const path = require('path');
const express = require('express');

const publicDir = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicDir));

module.exports = app;