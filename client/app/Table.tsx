"use client";

import usewindowDimensions from '@/app/utils/window';
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import {io} from "socket.io-client";
import {Game} from "./Game";
import {Player} from "./Player";
import BetPopup from "./BetPopup";

export let balance: number | undefined;

/** TODO: Add grainy look to the suit symbols */
/** Making this responsive is gonna be fun  */
const Table: FC = () => {
  const [possibleActions, setPossibleActions] = useState<string[]>(['hit', 'stand', 'double']);
  const [showPlayerButtons, setShowPlayerButtons] = useState<boolean>(false);
  const [showBetPopup, setShowBetPopup] = useState<boolean>(false);
  const [dealerTurn, setDealerTurn] = useState<boolean>(false);
  const [currGame, setCurrGame] = useState<Game | null>(null);
  const [socketID, setSocketID] = useState<string>('');
  const [socket, setSocket] = useState<any>(null);
  const [timer, setTimer] = useState<number>(30);

  const handleBetSubmit = (bet: number) => {
    // Emit the bet to the server
    socket.emit('placeBet', { socketID, bet });
    setShowBetPopup(false);
  };


  useEffect(() => {
    const socket = io("wws://blackjack-backend.onrender.com");
    setSocket(socket);
    
    // On connection, set the socket ID
    socket.on('connect', () => {
      console.log(`✅ Connected to server with socket ID: ${socket.id}`);
      setSocketID(socket.id!);
    });



    // Countdown timer for game start
    socket.on('timer', (secondsRemaining: number) => {
      console.log(`⏳ ${secondsRemaining} seconds remaining...`);
      setTimer(secondsRemaining);
    });



    // Need to collect bets from players
    socket.on('askBets', (game) => {
      balance = Game.fromObject(game).getPlayerByID(socket.id!).getBalance().getValue();
      setShowBetPopup(true);
    });



    // Start the game
    socket.on('startGame', (game) => {
      const startGame = Game.fromObject(game);
      startGame.startGame();
      setCurrGame(startGame); // Give everyone two cards
      socket.emit('startGame', startGame);
      //setShowPlayerButtons([true, true, true, true, true]);
    });


    // Update the game state
    socket.on('gameUpdate', (game) => {
      const gameUpdate = Game.fromObject(game);
      balance = gameUpdate.getPlayerByID(socket.id!).getBalance().getValue();
      setCurrGame(gameUpdate);
    });




    socket.on('playerTurn', (data) => {
      const newSocketID = data.socketID;
      const canHit = data.canHit;
      const canStand = data.canStand;
      const canDouble = data.canDouble;

      if (newSocketID === socket.id) {
        const actions = [];
        if (canHit) actions.push('hit');
        if (canStand) actions.push('stand');
        if (canDouble) actions.push('double');
        setPossibleActions(actions);
        setShowPlayerButtons(true);
      }
    });

    socket.on('nextPlayer', (playerID) => {
      console.log(`Next player: ${playerID}`);
      socket.emit('sendPlayerActions', playerID);
    });

    socket.on('playerDone', (playerID) => {
      console.log(`Player ${playerID} is done`);
      socket.emit('sendNextPlayer', playerID);
    });

    socket.on('dealerTurn', () => {
      setDealerTurn(true);
    });


    socket.on('endGame', (game) => {
      setDealerTurn(false);
      socket.emit('resetGame', game);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  
  const suitPaths = [
    require("../assets/suits/DiamondPattern.png"),
    require("../assets/suits/ClubPattern.png"),
    require("../assets/suits/SpadePattern.png"),
    require("../assets/suits/HeartPattern.png"),
  ];

  // Get the height and width of the window
  const { height, width } = usewindowDimensions();


  const pattern = [];
  //Horizontal & vertical background pattern
  for (let j = 0; j < height/100; j++) {
    for (let i = 0; i < width/100; i++) {
      pattern.push(
        <div key={"pattern row:"+j+" col:"+i} className="flex justify-center items-center" style={{ position: "relative", top: `${j * 100 + 70}px`, left: `${-100*(Math.floor((width/100)/2)-i)}px` }}>
          <div className="absolute m-auto mix-blend-screen opacity-15">
            <div className="dot"></div>
            <div className="line1"></div>
            <div key={`pattern-col`} className="grid grid-cols-2 gap-6">
              {suitPaths.map((path, index) =>
                index % 2 === 0 ? (
                  <div key={index} className="">
                    <Image key={index} src={path.default} alt="suit" width={30} height={30} />
                  </div>
                ) : null
              )}
            </div>
          </div>
          <div className="absolute m-auto mix-blend-screen opacity-15">
            <div className="line2"></div>
            <div key={`pattern-row`} className="grid gap-6">
              {suitPaths.map((path, index) => (
                index % 2 !== 0 ? (
                  <div key={index} className="">
                    <Image key={index} src={path.default} alt="suit" width={30} height={30} />
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </div>
      )
    }
  }

  const renderPlayerButtons = (playerID:number) => {
    return (
      <div className="player-buttons">
        {currGame?.GetPlayer(playerID).getID() === socketID && (
          <>
          {possibleActions.includes('hit') && (
            <button className="player-button" onClick={() => handleAction('hit', playerID)}>Hit</button>
          )}
          {possibleActions.includes('stand') && (
          <button className="player-button" onClick={() => handleAction('stand', playerID)}>Stand</button>
          )}
          {possibleActions.includes('double') && (
          <button className="player-button" onClick={() => handleAction('double', playerID)}>Double</button>
          )}
            {/* Add more buttons as needed */}
          </>
        )}
      </div>
    );
  };

  // Handle player actions (e.g., hit, stand, double)
  const handleAction = (action:String, playerID: number) => {
    console.log(`Player ${socketID} chose to ${action}`);
    socket.emit('playerAction', { currGame, socketID, action }); // Emit the action to the server 
    setShowPlayerButtons(false);
  };


  //* TODO: Add grainy look to the background */
  //* TODO: Add spot for insurance on tbale
  //**********IMPORTANT************* TODO: Fix text positioning on table */
  return (
    <div className="h-screen" style={{ backgroundColor: 'rgb(0, 80, 50)' }}>
      <div className="pattern-container" style={{ zIndex: "-1" }}>
        {pattern}
      </div>
      <div className="timer" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',  position: 'absolute', top: '1%', left: '1%', color: 'white', fontSize: '15px' }}>
      Time remaining: {timer} s
      <br />
      Balance: {balance}
     </div>
      <div className="dealer-half-circle">
        <div className="dealer-text-container">
          <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" id="circlePath1" d="M 50, 27 a 80, 60 0 0,0 100,0" />
            <text className='dealer-text'>
              <textPath href="#circlePath1" startOffset="50%" textAnchor="middle">
                BLACKJACK PAYS 3 TO 2
              </textPath>
            </text>
          </svg>
        </div>
      </div>
      <div className="half-ellipse-border-out"></div>
      <div className="half-ellipse-border-in"></div>
      <div className="hollow-half-ellipse">
        <div className="insurance-text-container">
          <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" id="circlePath3" d="M 50, 27 a 80, 45 0 0,0 100,0" />
              <text className='insurance-text'>
                <textPath href="#circlePath3" startOffset="50%" textAnchor="middle">
                  INSURANCE PAYS 2 TO 1
                </textPath>
              </text>
          </svg>
        </div>
      </div>
      <div className="dealer-square">
        <div className="dealer-square-inner">
          {currGame?.getDealer().map((card, index) => {
            let cardPath = `${card.getRank()}${card.getSuit()}.svg`;
            let cardImage = require(`../assets/cards/${cardPath}`).default;
            const dealerCardAmt = currGame?.getDealer().length;
            if (dealerCardAmt === 2 && index === 1 && !dealerTurn) {
              cardImage = require(`../assets/cards/1B.svg`).default;
            }

            return (
              <Image key={index} src={cardImage} alt={`card ${cardPath}`} className="card-image"       
                style={{
                position: 'relative',
                top: `-20px`, // Adjust the 20px to control the overlap amount 
                left: `${index * (dealerCardAmt-2)*(-10)}px`, // Adjust the 20px to control the overlap amount
                zIndex: index,
              }} loading="eager"/>
            );
          })}
        </div>
      </div>
      <div className="player-squares">
        <div className="player-square">
          {currGame?.GetPlayer(3).hasPassed() ? (
            // The player has passed, render message
            <div className="player-stat"><h2>Player has passed</h2></div>
            ) : (
            // The player has not passed, render the cards
            <>
            {currGame?.GetPlayer(3).getHand().getCards().map((card, index) => {
              const cardPath = `${card.getRank()}${card.getSuit()}.svg`;
              const cardImage = require(`../assets/cards/${cardPath}`).default;

              return (
                <div key={index} className = "card-container" style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Image key={index} src={cardImage} alt={`card ${cardPath}`} className="card-image"       
                    style={{
                    position: 'absolute',
                    top: `${-20 + index * -35}px`, // Adjust the 20px to control the overlap amount
                    left: `${index * 20}px`, // Adjust the 20px to control the overlap amount
                    width: '100%',
                    zIndex: index,
                  }} loading="eager"/>
                </div>
              );
            })}  
            {showPlayerButtons && renderPlayerButtons(3)}
            </>
          )}        
        </div>
        <div className="player-square">
          {currGame?.GetPlayer(1).hasPassed() ? (
            // The player has passed, render nothing or a specific message
            <div className="player-stat"><h2>Player has passed</h2></div>
            ) : (
            // The player has not passed, render the cards
            <>
            {currGame?.GetPlayer(1).getHand().getCards().map((card, index) => {
              const cardPath = `${card.getRank()}${card.getSuit()}.svg`;
              const cardImage = require(`../assets/cards/${cardPath}`).default;

              return (
                <div key={index} className = "card-container" style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Image key={index} src={cardImage} alt={`card ${cardPath}`} className="card-image"       
                    style={{
                    position: 'absolute',
                    top: `${-20 + index * -35}px`, // Adjust the 20px to control the overlap amount
                    left: `${index * 20}px`, // Adjust the 20px to control the overlap amount
                    width: '100%',
                    zIndex: index,
                  }} loading="eager"/>
                </div>
              );
            })}  
            {showPlayerButtons && renderPlayerButtons(1)}
            </>
          )}
        </div>
        <div className="player-square">
          {currGame?.GetPlayer(0).hasPassed() ? (
            // The player has passed, render nothing or a specific message
            <div className="player-stat"><h2>Player has passed</h2></div>
            ) : (
            // The player has not passed, render the cards
            <>
            {currGame?.GetPlayer(0).getHand().getCards().map((card, index) => {
              const cardPath = `${card.getRank()}${card.getSuit()}.svg`;
              const cardImage = require(`../assets/cards/${cardPath}`).default;

              return (
                <div key={index} className = "card-container" style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Image key={index} src={cardImage} alt={`card ${cardPath}`} className="card-image"       
                    style={{
                    position: 'absolute',
                    top: `${-20 + index * -35}px`, // Adjust the 20px to control the overlap amount
                    left: `${index * 20}px`, // Adjust the 20px to control the overlap amount
                    width: '100%',
                    zIndex: index,
                  }} loading="eager"/>
                </div>
              );
            })}  
            {showPlayerButtons && renderPlayerButtons(0)}
            </>
          )}
        </div>
        <div className="player-square">
          {currGame?.GetPlayer(2).hasPassed() ? (
            // The player has passed, render nothing or a specific message
            <div className="player-stat"><h2>Player has passed</h2></div>
            ) : (
            // The player has not passed, render the cards
            <>
            {currGame?.GetPlayer(2).getHand().getCards().map((card, index) => {
              const cardPath = `${card.getRank()}${card.getSuit()}.svg`;
              const cardImage = require(`../assets/cards/${cardPath}`).default;

              return (
                <div key={index} className = "card-container" style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Image key={index} src={cardImage} alt={`card ${cardPath}`} className="card-image"       
                    style={{
                    position: 'absolute',
                    top: `${-20 + index * -35}px`, // Adjust the 20px to control the overlap amount
                    left: `${index * 20}px`, // Adjust the 20px to control the overlap amount
                    width: '100%',
                    zIndex: index,
                  }} loading="eager"/>
                </div>
              );
            })}  
            {showPlayerButtons && renderPlayerButtons(2)}
            </>
          )}
        </div>
        <div className="player-square">
          {currGame?.GetPlayer(4).hasPassed() ? (
            // The player has passed, render nothing or a specific message
            <div className="player-stat"><h2>Player has passed</h2></div>
            ) : (
            // The player has not passed, render the cards
            <>
            {currGame?.GetPlayer(4).getHand().getCards().map((card, index) => {
              const cardPath = `${card.getRank()}${card.getSuit()}.svg`;
              const cardImage = require(`../assets/cards/${cardPath}`).default;

              return (
                <div key={index} className = "card-container" style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Image key={index} src={cardImage} alt={`card ${cardPath}`} className="card-image"       
                    style={{
                    position: 'absolute',
                    top: `${-20 + index * -35}px`, // Adjust the 20px to control the overlap amount
                    left: `${index * 20}px`, // Adjust the 20px to control the overlap amount
                    width: '100%',
                    zIndex: index,
                  }} loading="eager"/>
                </div>
              );
            })}  
            {showPlayerButtons && renderPlayerButtons(4)}
            </>
          )}
        </div>
      </div>
      <div className="dealer-info-container">
        <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" id="circlePath2" d="M 50, 27 a 80, 80 0 0,0 100,0" />
          <text className='dealer-info'>
            <textPath href="#circlePath2" startOffset="50%" textAnchor="middle">
              Dealer must stand on 17 and must draw to 16
            </textPath>
          </text>
        </svg>
      </div>
      {showBetPopup && <BetPopup onSubmit={handleBetSubmit} />}
    </div>
  );
}

export default Table;