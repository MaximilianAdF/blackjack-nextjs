import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
    }
});

let currentGame: any = null; // Initialize the current game state

io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    // When a new connection is established, send the current game state (if available) to the new connection
    if (currentGame) {
        socket.emit('currentGame', currentGame);
    }

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('newGame', (game) => {
        console.log('new game received');
        console.log(game);

        // Update the current game state
        currentGame = game;

        // Broadcast the new game state to all connected sockets
        io.emit('gameUpdate', game);
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});
