const { app, server, port } = require('./app');

server.listen(port, () => {
    console.log('Server is up on port ' + port);
})