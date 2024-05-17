import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Game } from '../client/app/Game';
import { Player } from '../client/app/Player';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
    }
});
export const socketIDQueue: string[] = []; // Initialize the socket ID queue
export let currentGame: any = null; // Initialize the current game state
let timer: NodeJS.Timeout | null = null;
let playerDidCount = 0;
let turnOrder: number[] = [3, 1, 0, 2, 4];
let gameReset = false;

interface PlayerActionData {
    currGame: any;
    socketID: string;
    action: 'hit' | 'stand' | 'double';
  }


io.on('connection', (socket: Socket) => {
    console.log('✅ Connected to server with socket ID:', socket.id);
    socketIDQueue.push(socket.id); // Add the socket ID to the queue
    
    // If connection is disconnected, remove the socket ID from the queue
    socket.on('disconnect', () => {
        console.log('❌ Disconnected from server with socket ID:', socket.id);
        const index = socketIDQueue.indexOf(socket.id);
        if (index !== -1) {
            socketIDQueue.splice(index, 1);
        }
        if (socketIDQueue.length === 0) {
            clearInterval(timer!);
            currentGame = null;
            timer = null;
        }
    });

    const sendPlayerActions = (player: Player) => {
        player = currentGame.getPlayerByID(player.getID());

        const canHit = player.getHand().canHit();
        const canStand = player.getHand().canStand();
        const canDouble = player.getHand().canDoubleDown();
        const hasBusted = currentGame.getHandValue(player.getHand().getCards()) > 21;
        const hasBlackjack = currentGame.getHandValue(player.getHand().getCards()) === 21;
        
        console.log(`🃏 Player ${player.getID()} has ${currentGame.getHandValue(player.getHand().getCards())} | ${canHit} ${canStand} ${canDouble}`);
        if ((hasBusted || hasBlackjack) || (!canHit) || (player.getHand().didStand())) {
            return -1;
        }

        // Emit the event to the client and wait for response
        io.emit('playerTurn', { 
            socketID: player.getID(), 
            canHit, 
            canStand, 
            canDouble
        });
        return 1;
    };

    socket.on('sendPlayerActions', (playerID) => {
        if (socket.id === currentGame.GetPlayer(playerID).getID()) {
            const player = currentGame.GetPlayer(playerID);
            const res = sendPlayerActions(player);
            if (res === -1) {
                console.log(`🃏 Player ${playerID} done\n`);
                io.emit('playerDone', currentGame.GetPlayer(playerID).getID());
            }
        }

    });


    socket.on('playerAction', (data) => {
        // Handle the player's choice
        currentGame = Game.fromObject(data.currGame);
        const playerInGame = currentGame.getPlayerByID(data.socketID);

        switch (data.action) {
            case 'hit':
                playerInGame.getHand().hit(currentGame.deck);
                break;
            case 'stand':
                playerInGame.getHand().stand();
                break;
            case 'double':
                playerInGame.getHand().doubleDown(currentGame.deck);
                break;
        }

        // Update the player's balance
        currentGame.getPlayerByID(data.socketID).getBalance().updateBalance(currentGame.getPlayerByID(data.socketID).getHand().getBalance().getValue())
        console.log(`🃏 Player ${playerInGame.getID()} chose ${data.action}`)

        // Update the game for all players
        io.emit('gameUpdate', currentGame);
        const res = sendPlayerActions(playerInGame);
        if (res === -1) {
            console.log(`🃏 Player ${playerInGame.getID()} done\n`);
            io.emit('playerDone', playerInGame.getID());
        }
    });

    socket.on('startGame', (game) => {
        console.log('⚖️  Starting choice round...')

        currentGame = Game.fromObject(game);
        const playerCount = currentGame.getPlayerCount();
        if (playerCount === 1) turnOrder = [0];
        else if (playerCount === 2) turnOrder = [1, 0];
        else if (playerCount === 3) turnOrder = [1, 0, 2];
        else if (playerCount === 4) turnOrder = [3, 1, 0, 2];
        console.log('🔄 Turn order:', turnOrder + '\n');
        
        const nextPlayer = turnOrder.shift();
        io.emit('gameUpdate', currentGame);
        io.emit('nextPlayer', nextPlayer);
    });

    socket.on('sendNextPlayer', (socketID) => {
        if (socket.id === socketID) {
            const nextPlayer = turnOrder.shift();
            if (nextPlayer !== undefined) {
                io.emit('nextPlayer', nextPlayer);
            } else {
                console.log('🎲 Starting dealer turn...')
                io.emit('dealerTurn');
                io.emit('gameUpdate', currentGame);
                setTimeout(dealerTurn, 2000);
            }
        }
    });


    const dealerTurn = () => {
        const dealerHand = currentGame.getDealer();
        let dealerHandValue = currentGame.getHandValue(dealerHand);
        // Dealer hits until hand value is at least 17
        if (dealerHandValue < 17) {
            currentGame.dealerHit();
            console.log(`🃏 Dealer hits | ${dealerHandValue}`);
            io.emit('gameUpdate', currentGame);
            // Call the function recursively after a delay
            setTimeout(dealerTurn, 2000);
        }
        else {
            console.log(`🃏 Dealer | ${dealerHandValue}`);
            currentGame.awardWinners();
            io.emit('gameUpdate', currentGame);
            setTimeout(() => endGame(currentGame), 5000);
        }
    };

    const endGame = (game: Game) => {
        io.emit('endGame', game);
        gameReset = false;
    }
    
        
    // Receive player's bet and emit new game state
    socket.on('placeBet' , (data) => {
        const socketID = data.socketID;
        const betAmount = data.bet;

        console.log(`💰 Player ${socketID} bet ${betAmount} | ${playerDidCount+1}/${currentGame.getPlayerCount()}`)
        if (currentGame) {
            currentGame.getPlayerByID(socketID).bet(betAmount);
            playerDidCount++;

            // If all players have placed their bets, emit the new game state
            if (playerDidCount === currentGame.getPlayerCount()) {
                socket.emit('startGame', currentGame);
                playerDidCount = 0;
            }
        }
    });

    

    socket.on('resetGame', (game) => {
        if (!gameReset) {
            gameReset = true;
            const prevGame = Game.fromObject(game);
            console.log('\n🔄 Resetting game...')
            currentGame = null;
            timer = null;
            playerDidCount = 0;
            beginGame(prevGame);
        }
    });


    // Create a new game if any player is connected
    const beginGame = (prevGame?: Game) => {
        if (!currentGame && !timer) {
            console.log(`⏳ Starting 30 second timer for players to join...\n`);
            
            let secondsRemaining = 5;
            timer = setInterval(() => {
                if (secondsRemaining >= 0) {
                    io.emit('timer', secondsRemaining);
                    secondsRemaining--;
                } else {
                    clearInterval(timer!);
                    if (socketIDQueue.length > 0) {
                        console.log(`🎮 Creating game with ${socketIDQueue}!`)
                        const players: Player[] = socketIDQueue.map((id, index) => {
                            if (prevGame && prevGame.getPlayerByID(id)) {
                                return prevGame.getPlayerByID(id);
                            } else {
                                return new Player(id, 1000);
                            }
                        });
                        currentGame = new Game(players);
                        io.emit('askBets', currentGame);
                    } else {
                        console.log('🚫 No players connected, no game created');
                    }
                }
            }, 1000);
        }
    };
    beginGame();
    
    




});

server.listen(3001, () => {
    console.log('👂 Listening on *:3001');
});
