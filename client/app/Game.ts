import { Chip } from './Chip';
import { Deck } from './Deck';
import { Player } from './Player';
import { Card } from './Card';

export class Game {
    private players: Player[];
    private dealer: Card[];
    private deck: Deck;
    private roundWinners;
    private numberOfPlayers;

    constructor(Players: Player[] = [],dealer: Card[]=[], deck: Deck|null =null,roundWinners: Player[] = [], numberOfPlayers: number = 1) {
        // Initialize players array with 5 zeros
        if (Players.length ==0 ){
            this.players = Array(5).fill(new Player(0)); // Assuming Player constructor is parameterless
        }else {
            this.players = Players
        }

        this.roundWinners = roundWinners;
        this.numberOfPlayers = numberOfPlayers;
        this.dealer = dealer;

        if (deck!=null){
            this.deck = deck;

        }else{
            this.deck = new Deck();
        }

    }


    public getdealer(){
        return this.dealer;
    }
    public playerHit(index:number){
        this.players[index].getHand().hit(this.deck);
    }

    /**
     * The value of a hand
     * @param Card[]
     */
    public getHandValue(hand: Card[]): number {
        let value = 0;
        let aces = 0;
        for (const card of hand) {
            value += card.getValue();
            if (card.getRank() === 'A') {
                aces++;
            }
        }
        while (value > 21 && aces) {
            value -= 10;
            aces--;
        }
        return value;
    }

    public dealerMove(): void {

        while (this.getHandValue(this.dealer) >= 17){
            //hit
            const card = this.deck.dealCard();
            if (card) {
                this.dealer.push(card);
            } else {
                // Need to update the deck logic to handle this case (i.e. reshuffle the deck)
                throw new Error('No more cards in the deck: ' + JSON.stringify(this.deck));
            }
        } 
        if (this.getHandValue(this.dealer) > 21) {
            for (const player of this.players) {
                if (this.getHandValue(player.getHand().getCards()) <= 21) {
                    this.roundWinners.push(player);
                }
            }
        }
        else{
            for (const player of this.players) {
                if (this.getHandValue(player.getHand().getCards()) > this.getHandValue(this.dealer) && this.getHandValue(player.getHand().getCards()) <= 21) {
                        this.roundWinners.push(player);
                    }
                }
            }
    }

    /**
     * Add a player to the game
     * @param Player
     */
    public addPlayer(player: Player): void {
        const zeroBalanceIndex = this.players.findIndex(player => player.getBalance() === 0);
        if (zeroBalanceIndex !== -1) {
            this.players[zeroBalanceIndex] = player;
        } else{
            throw new Error('No more room for players');
        }
    }


    /**
     * Remove a player from the game
     * @param Player
     */
    public removePlayer(player: Player): void {
        const index = this.players.indexOf(player);
        if (index !== -1) {
            // Remove the player
            this.players.splice(index, 1);
            // Replace with a new player with 0 balance
            this.players.splice(index, 0, new Player(0)); 
        }
    }
    


    /**
     * GetPlayer
     */
    public GetPlayer(index: number): Player {
        return this.players[index];
        
    }


    /**
     * end round
     */
    public EndRound(): void {
        this.dealerMove();



        for (const player of this.players) {  // pays out the winners
            if (this.roundWinners.includes(player)) {
                player.win();
            }
        }
        this.roundWinners = [];


        if (this.deck.getNumCards() < 12) {// check if there are enough cards in the deck
            this.deck = new Deck();
        }


        //empty the hands of the players and dealer
        for (const player of this.players) {
            player.removeHand()
        } 
        this.dealer = [];
    }


    /**
     * Start the game  when all have placed their bets or passed
     */

    public startGame(): void {
        
        for (let i = 0; i < 2; i++) {
            for (const player of this.players) { // check if all players have passed or bet
                if (!player.passed) {
                    if (player.getHand() == null) {
                        throw new Error('Player has not bet yet');
                    }else{
                        player.getHand().hit(this.deck);// give the player a card
                    }
                }
            }
            const card = this.deck.dealCard();// ggive the dealer a card
            if (card) {
                this.dealer.push(card);
            }
        }
    }
}
