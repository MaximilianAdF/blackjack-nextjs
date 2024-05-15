import { Card } from './Card';
import { Balance } from './Balance';
import { Hand } from './Hand';

export class Player {
    private hand: Hand | null;
    private balance: Balance;
    public passed: boolean = true;

    /**
     * Constructor for the Player class
     * @param balance 
     */
    constructor(amount: number, passed: boolean = false, hand: Hand | null = null) {
        this.balance = new Balance(amount);
        this.passed = passed;
        this.hand = hand;
    }

    static fromObject(obj: any): Player {
        const hand = obj.hand ? Hand.fromObject(obj.hand) : null; // If the player has a hand, create a Hand object from the object
        return new Player(obj.balance, obj.passed, hand);
    }

    /**
     * Makes a new hand for the player with the betted abount
     * @param amount
     */
    public newHand(balance: Balance, amount: number):void{
        this.hand = new Hand(balance, amount);
    }

    /**
     * Amount to bet and makes a new hand
     * @param amount 
     */
    public bet(amount: number): void {
        if (amount > this.balance.getValue()) {
            throw new Error('Insufficient balance');
        } else if (amount > 0) {
            this.passed = false;
            this.balance.removeBalance(amount);
            this.newHand(this.balance, amount);
        }
    }

    /**
     * Number of chips to won
     * @param amount 
     */
    public win(hand: Hand | null = this.hand): void {
        if (hand !== null && hand !== undefined) {
            const betAmount = hand.getBetAmount();
            this.balance.addBalance(betAmount);
        } else {
            throw new Error('No hand has been made yet');
        }
    }

    /**
     * Value of balance
     * @param 
     */
    public getBalance(): number {
        return this.balance.getValue();
    }


    public hasHand(): boolean {
        return this.hand !== null;
    }

    /**
     * Return the cards in the players hand
     * @param 
     */
    public getHand(): Hand {
        if( this.hand != null){
            return this.hand;
        } else{
            throw new Error('No hand have been made yet');
        }
    }

    public removeHand(): void {
        this.hand = null;
    }

    public hasPassed(): boolean {
        return this.passed;
    }



}