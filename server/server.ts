import { Server } from 'socket.io';

const express = require('express');
const http = require('http');
const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // On a new connection, need to load the current game or create a new one if first player
    // All the info/data for the game will be sent to the server and stored in memory (arrays, objects, etc)
    // When new players join, they will be sent the current game state so it can be displayed on their screen
    // When a player makes a move, the server will update the game state and send it to all players
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});