import { Card } from './Card';
import { Deck } from './Deck';

export class Player {
    private hand: Card[] = [];
    private balance: number;

    /**
     * Constructor for the Player class
     * @param balance 
     */
    constructor(balance: number) {
        this.balance = balance;
    }

    /**
     * Draw a card from the deck
     * @returns Deck | void
     */
    public drawCard(deck: Deck): void {
        const card = deck.dealCard();
        if (card) {
            this.hand.push(card);
        }
    }

    /**
     * Number of chips to bet
     * @param amount 
     */
    public bet(amount: number): void {
        if (amount > this.balance) {
            throw new Error('Insufficient balance');
        } else if (amount < 0) {
            this.balance -= amount;
        }
    }

    /**
     * Number of chips to won
     * @param amount 
     */
    public win(amount: number): void {      
        this.balance += amount;
    }

    /**
     * Value of balance
     * @param 
     */
    public getBalance(): number {
        return this.balance;
    }

    /**
     * returns the number off each chips the player
     * have in a list staring from the largest.
     * @param 
     */
    public getChips(): number[] {
        const chipValues = [5000, 1000, 100, 50, 25, 10, 5, 1];
        let remainingBalance = this.balance;
        const chips: number[] = [];

        for (const value of chipValues) {
            const count = Math.floor(remainingBalance / value);
            chips.push(count);
            remainingBalance -= count * value;
        }

        return chips;
    }

    /**
     * Return the cards in the players hand
     * @param 
     */
    public getHand(): Card[] {
        return this.hand;
    }



}