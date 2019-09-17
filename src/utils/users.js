const users = [];

const addUser = ({ id, username, room }) => {

    // sanitize data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate data
    if (!username || !room) {
        return { error: 'Username and Room are required.' };
    }

    // check for existing user 
    const isFound = users.find((user) => (
        user.room === room && user.username === username
    ));

    // validate username
    if (isFound) {
        return { error: 'Username is already in use.' };
    }

    // add user
    const user = { id, username, room };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1);
    }
};

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};