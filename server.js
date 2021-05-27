const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');


const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', ({ author }) => {
    console.log('Hello new user ' + author);

    users.push({ name: author, id: socket.id });
    socket.broadcast.emit('userConnect', author);

    console.log('Logged users', users);
  });

  socket.on('disconnect', () => {
    users.filter(user => user.id === socket.id ? socket.broadcast.emit('userDisconnect', user.name) : null);

    users = users.filter(user => user.id != socket.id);

    console.log('Oh, socket ' + socket.id + ' has left');
    console.log('Logged users', users)
  });
});