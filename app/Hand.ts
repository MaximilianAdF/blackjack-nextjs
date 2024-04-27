import { Card } from './Card';
import { Deck } from './Deck';

export class Hand {
    private betAmount: number;    // Number of chips in the player's balance
    private double: boolean;    // Player has chosen to double down on this hand (No more hit, double, or split)
    private split: boolean;     // Player has chosen to split this hand
    private stand: boolean;     // Player has chosen to stand on this hand (No more hit, double, or split)
    private cards: Card[]       // Cards in the hand

    /**
     * Constructor for the Player class
     * @param balance 
     */
    constructor(betAmount: number, double: boolean, split: boolean, stand: boolean, cards: Card[] = []) {
        this.betAmount = betAmount;
        this.double = double;
        this.split = split;
        this.stand = stand;
        this.cards = cards;
    }

    /**
     * Get a card from the deck
     * @param deck
     * @returns void
     */
    public hitHand(deck: Deck): void {
        if (this.stand) {
            throw new Error('Cannot hit on a hand that has stood');
        } else if (this.double) {
            throw new Error('Cannot hit on a hand that has doubled down');
        } else {
            const card = deck.dealCard();
            if (card) {
                this.cards.push(card);
            } else {
                throw new Error('No more cards in the deck');
            }
        }
    }

    /**
     * Hand has chosen to split into two hands
     * Calling this method requires that after splitting, both hands hit once automatically.
     * @param deck 
     * @returns Hand[] - the two new hands after splitting
     */
    public splitHand(deck: Deck): Hand[] {
        if (this.split) {
            throw new Error('Cannot split a hand that has already been split');
        } else if (this.cards.length !== 2) {
            throw new Error('Cannot split a hand that does not have exactly two cards');
        } else if (this.cards[0].getValue() !== this.cards[1].getValue()) {
            throw new Error('Cannot split a hand with cards of different ranks');
        } else {
            this.split = true; // Mark both hands as split
            this.cards = [this.cards[0]]; // Keep the first card in the original hand
            const newHand = new Hand(this.betAmount, this.double, this.split, this.stand, [this.cards[1]]); // Create a new hand with the second card
            return [this, newHand];
        }
    }

    /**
     * Hand has chosen to double down (double the bet and hit once more automatically)
     * Calling this method requires that the players balance is sufficient to double the bet (i.e. betAmount * 2 <= player balance)
     * @param deck 
     * @returns void
     */
    public doubleDown(deck: Deck): void {
        if (this.double) {
            throw new Error('Cannot double down on a hand that has already doubled down');
        } else if (this.cards.length !== 2) {
            throw new Error('Cannot double down on a hand that does not have exactly two cards');
        } else {
            this.double = true;
            this.betAmount *= 2;
            this.hitHand(deck); // Automatically hit once after doubling down
        }
    }

    /**
     * Hand has chosen to stand
     * @param 
     * @returns void
     */
    public standHand(): void {
        this.stand = true;
    }

    /**
     * Number of chips that the hand has on it
     * @param 
     */
    public getBetAmount(): number {
        return this.betAmount;
    }

    /**
     * Return the cards in the hand
     * @param 
     */
    public getCards(): Card[] {
        return this.cards;
    }
}