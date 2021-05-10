const _ = require('lodash');
const moment = require('moment');

const { validateString } = require('./utils/validation.js');
const { users } = require('./data/users.js');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`Client conected to server`);

        socket.on('join', (joinData, fail) => {
            console.log(`user joined to server from client`, joinData, fail);

            const isValidName = validateString(joinData.name);
            const isValidRoom = validateString(joinData.room);

            if (!isValidName && !isValidRoom) {
                return fail({
                    type: 'InputError',
                    message: 'Please enter a Display Name and Room Name to join!'
                });
            } else if (!isValidName) {
                return fail({
                    type: 'InputError',
                    message: 'Please enter a Display Name to join!'
                });
            } else if (!isValidRoom) {
                return fail({
                    type: 'InputError',
                    message: 'Please enter a Room Name to join!'
                });
            }

            const maxUserCount = 4;
            const userCountByRoom = users.getUserCountByRoom(joinData.room);
            if (userCountByRoom === maxUserCount) {
                return fail({
                    type: 'MaxUserReached',
                    message: `There are already ${maxUserCount} players in room: ${joinData.room}. Please join another room.`
                });
            }

            socket.join(joinData.room);

            const thisUser = users.addUser(socket.id, joinData.name, joinData.room);
            io.to(joinData.room).emit('updateUsers', users.list.filter(u => u.room === joinData.room));

            socket.emit('setThisTeam', { thisTeam: thisUser.team });

            // socket.emit('receiveMessage', {
            //     type: 'system',
            //     text: `Welcome, ${joinData.name}.`
            // });
            // socket.broadcast.to(joinData.room).emit('receiveMessage', {
            //     type: 'system',
            //     text: `${joinData.name} joined.`
            // });

            socket.on('clickPlayButtonS', (data, done, fail) => {
                console.log(`clickPlayButtonS with ${JSON.stringify(data)}`);
                try {
                    io.broadcast.to(joinData.room).emit('clickPlayButton', data);
                    if (done) {
                        done();
                    }
                } catch (e) {
                    if (fail) {
                        fail(e);
                    }
                }
            });

            socket.on('clickTokenS', (data, done, fail) => {
                console.log(`clickTokenS with ${JSON.stringify(data)}`);
                try {
                    io.broadcast.to(joinData.room).emit('clickToken', data);
                    if (done) {
                        done();
                    }
                } catch (e) {
                    if (fail) {
                        fail(e);
                    }
                }
            });

            socket.on('setPlayerTypeS', (data, done, fail) => {
                console.log(`setPlayerTypeS with ${JSON.stringify(data)}`);
                try {
                    io.broadcast.to(joinData.room).emit('setPlayerType', data);
                    if (done) {
                        done();
                    }
                } catch (e) {
                    if (fail) {
                        fail(e);
                    }
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`${socket.id} left!!!!!!!!!!!!!!!!!!!!!!`);
            const user = users.removeUser(socket.id);
            if (_.isString(user)) {
                console.log(user);
                return;
            }
            io.to(user.room).emit('updateUsers', users.list.filter(u => u.room === user.room));
            io.to(user.room).emit('receiveMessage', {
                type: 'system',
                text: `${user.name} left.`
            });
        });
    });
};