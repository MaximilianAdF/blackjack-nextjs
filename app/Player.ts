import { Card } from './Card';
import { Deck } from './Deck';
import { Balance } from './Balance';

export class Player {
    private hand: Card[] = [];
    private balance: Balance;

    /**
     * Constructor for the Player class
     * @param balance 
     */
    constructor(amount: number) {
        this.balance = new Balance(amount);
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
        if (amount > this.balance.getValue()) {
            throw new Error('Insufficient balance');
        } else if (amount < 0) {
            this.balance.removeBalance(amount);
        }
    }

    /**
     * Number of chips to won
     * @param amount 
     */
    public win(amount: number): void {      
        this.balance.addBalance(amount);
    }

    /**
     * Value of balance
     * @param 
     */
    public getBalance(): number {
        return this.balance.getValue();
    }


    /**
     * Return the cards in the players hand
     * @param 
     */
    public getHand(): Card[] {
        return this.hand;
    }



}