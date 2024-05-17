import { Chip } from './Chip';
import { Deck } from './Deck';
import { Player } from './Player';
import { Card } from './Card';
import { Hand } from './Hand';

export class Game {
    private players: Player[];
    private dealer: Card[];
    private deck: Deck;
    private roundWinners;
    private numberOfPlayers;

    constructor(Players: Player[] = [],dealer: Card[]=[], deck: Deck|null =null,roundWinners: Player[] = [], numberOfPlayers: number = 1) {
        // Initialize players array with 5 zeros
        if (Players.length ==0 ){
            this.players = Array(5).fill(new Player("o",0, true)); // Assuming Player constructor is parameterless
        }else {
            this.players = Players
            while (this.players.length < 5) {
                this.players.push(new Player("o",0, true));
            }
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


    static fromObject(obj: any): Game {
        return new Game(
            obj.players.map((player: any) => Player.fromObject(player)),
            obj.dealer.map((card: any) => Card.fromObject(card)),
            Deck.fromObject(obj.deck),
            obj.roundWinners.map((player: any) => Player.fromObject(player)),
            obj.numberOfPlayers
        )
    }

    public getDealer(){
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

        while (this.getHandValue(this.dealer) <= 17){
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
                if (player.getID() != 'o' && this.getHandValue(player.getHand().getCards()) <= 21) {
                    this.roundWinners.push(player);
                }
            }
        }
        else{
            for (const player of this.players) {
                if (player.getID() != 'o' && this.getHandValue(player.getHand().getCards()) > this.getHandValue(this.dealer) && this.getHandValue(player.getHand().getCards()) <= 21) {
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
        const zeroBalanceIndex = this.players.findIndex(player => player.getBalance().getValue() === 0);
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
            this.players.splice(index, 0, new Player("o",0)); 
        }
    }
    


    /**
     * GetPlayer
     */
    public GetPlayer(index: number): Player {
        return this.players[index];
        
    }

    public getPlayerByID(id: string): Player {
        return this.players.find(player => player.getID() === id)!;
    }


    /**
     * Check the player que
     */
    public emptySeat(): Boolean {
        const zeroBalanceIndex = this.players.findIndex(player => player.getBalance().getValue() === 0);
        if (zeroBalanceIndex !== -1) {
            return true
        } else{
            return false
        }
    }

    // Get player count
    public getPlayerCount(): number {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getID() === "o") {
                return i;
            }
        }
        return 5;
    }

    public getDeck(): Deck {
        return this.deck;
    }


    /**
     * Start the game  when all have placed their bets or passed
     */

    public startGame(): void {
        for (let i = 0; i < 2; i++) {
            for (const player of this.players) {
                if (!player.hasPassed()) {
                    if (!player.hasHand()) {
                        throw new Error('Player has not made a hand yet'); // Modified error message
                    } else {
                        player.getHand().hit(this.deck);
                    }
                }
            }
            const card = this.deck.dealCard();
            if (card) {
                this.dealer.push(card);
            }
        }
    }

    public dealerHit(): void {
        this.dealer.push(this.deck.dealCard()!);
    }

    public awardWinners(): void {
        const dealerValue = this.getHandValue(this.dealer);
        for (const player of this.players) {
            if (player.hasHand()) {
                const playerValue = this.getHandValue(player.getHand().getCards());
                if ((playerValue > dealerValue && playerValue <= 21) || (dealerValue > 21 && playerValue <= 21)) {
                    player.getBalance().updateBalance(player.getBalance().getValue() + player.getHand().getBetAmount() * 2);
                    this.roundWinners.push(player);
                } else if (playerValue === dealerValue) {
                    player.getBalance().updateBalance(player.getBalance().getValue() + player.getHand().getBetAmount());
                    this.roundWinners.push(player);
                }
            }
        }
    }
}
