import { Card } from './Card';
import { Deck } from './Deck';

export class Player {
    private hand: Card[] = [];
    private balance: number;

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
        this.balance -= amount;
    }

    /**
     * Number of chips to won
     * @param amount 
     */
    public win(amount: number): void {      
        this.balance += amount;
    }

    /**
     * Number of chips in balance
     * @param 
     */
    public getBalance(): number {
        return this.balance;
    }

    /**
     * Return the cards in the players hand
     * @param 
     */
    public getHand(): Card[] {
        return this.hand;
    }


}