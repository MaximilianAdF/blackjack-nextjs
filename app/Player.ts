import { Card } from './Card';
import { Balance } from './Balance';
import { Hand } from './Hand';

export class Player {
    private hand: Hand | null;
    private balance: Balance;

    /**
     * Constructor for the Player class
     * @param balance 
     */
    constructor(amount: number) {
        this.balance = new Balance(amount);
        this.hand = null;
    }


    /**
     * Makes a new hand for the player with the betted abount
     * @param amount
     */
    public newHand(amount: number):void{
        this.hand = new Hand(amount);
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
        if( this.hand != null){
            return this.hand.getCards();
        } else{
            throw new Error('No hand have been made yet');
        }

    }



}