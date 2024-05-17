import { Balance, chipValues } from './Balance'; 
import { Card } from './Card';
import { Deck } from './Deck';
import { Chip } from './Chip';

export class Hand {
    private playerBalance: Balance; // Number of balance in the player's balance
    private betAmount: number;      // Number of balance bet on this hand
    private hasDouble: boolean;     // Player has chosen to double down on this hand (No more hit, double, or split)
    private hasSplit: boolean;      // Player has chosen to split this hand
    private hasStand: boolean;      // Player has chosen to stand on this hand (No more hit, double, or split)
    private cards: Card[]           // Cards in the hand
    private chips: Map<Chip, number> // Chips on the hand

    /**
     * Constructor for the Hand class
     * @param betAmount
     */
    constructor(playerBalance: Balance, betAmount: number, hasDouble: boolean = false, hasSplit: boolean = false, hasStand: boolean = false, cards: Card[] = []) {
        this.playerBalance = playerBalance;
        this.betAmount = betAmount;
        this.hasDouble = false;
        this.hasSplit = hasSplit;
        this.hasStand = false;
        this.cards = cards;
        this.chips = new Map();
        this.calculateChips();
    }

    static fromObject(obj: any): Hand {
        const cards: Card[] = [];
        for (const card of obj.cards) {
            cards.push(Card.fromObject(card));
        }
        return new Hand(new Balance(obj.playerBalance.value), obj.betAmount, obj.hasDouble, obj.hasSplit, obj.hasStand, cards);
    }


    /**
     * Check if the hand can hit, i.e.:
     * - the hand has not already stood
     * - the hand has not already doubled down
     * @param
     * @returns boolean
     */
    public canHit(): boolean {
        return !this.hasStand && !this.hasDouble;
    }


    /**
     * Get a card from the deck
     * @param deck
     * @returns void
     */
    public hit(deck: Deck): void {
        if (!this.canHit()) {
            throw new Error('Cannot hit on this hand: ' + JSON.stringify(this));
        } else {
            const card = deck.dealCard();
            if (card) {
                this.cards.push(card);
            } else {
                // Need to update the deck logic to handle this case (i.e. reshuffle the deck)
                throw new Error('No more cards in the deck: ' + JSON.stringify(deck));
            }
        }
    }



    /**
     * Check if the hand can split, i.e.:
     * - the two cards in the current hand have the same value (e.g. 10 of hearts and 10 of diamonds)
     * - player has enough chips to support the new hand `(i.e. betAmount <= player balance)`
     * - the hand has exactly two cards 
     * - it has not already been split
     * - hand has not already stood
     * @param
     * @returns boolean
     */
    public canSplit(): boolean {
        return this.cards[0].getValue() === this.cards[1].getValue() &&
               this.betAmount <= this.playerBalance.getValue() && 
               this.cards.length === 2 &&
               !this.hasSplit &&
               !this.hasStand;
    }

    /**
     * Hand has chosen to split into two hands
     * Calling this method means:
     * - that after splitting, both hands hit once automatically.
     * - the player's balance is reduced by the `betAmount` to support the new hand
     * @param deck 
     * @returns `Hand[]` - the two new hands after splitting
     */
    public split(deck: Deck): Hand[] {
        if (!this.canSplit()) {
            throw new Error('Cannot split this hand: ' + JSON.stringify(this));
        } else {
            this.hasSplit = true; // Mark both hands as split
            this.playerBalance.removeBalance(this.betAmount); // Remove the bet amount for new hand from the player's balance 
            
            // Original hand
            this.cards = [this.cards[0]]; // Keep the first card in the original hand
            this.hit(deck) // Hit once to get a new card for the original hand

            // New 2nd hand
            const newHand = new Hand(this.playerBalance, this.betAmount, this.hasDouble, this.hasSplit, this.hasStand, [this.cards[1]]); // Create a new hand with the second card
            newHand.hit(deck); // Hit once to get a new card for the new hand

            return [this, newHand];
        }
    }



    /**
     * Check if the hand can double down, i.e.:
     * - player has enough balance to double the bet `(i.e. betAmount <= player balance)`
     * - the current hand has exactly two cards
     * - the hand has not already doubled down
     * - the hand has not already stood
     * @param
     * @returns boolean
     */
    public canDoubleDown(): boolean {
        return (this.betAmount <= this.playerBalance.getValue() && 
                this.cards.length === 2 && 
                !this.hasDouble && 
                !this.hasStand);
    }


    /**
     * Hand has chosen to double down (double the bet and hit once more automatically)
     * Calling this method requires that the players balance is sufficient to double the bet (i.e. betAmount  <= player balance)
     * @param deck 
     * @returns void
     */
    public doubleDown(deck: Deck): void {
        if (!this.canDoubleDown()) {
            throw new Error('Cannot double down on this hand: ' + JSON.stringify(this));
        } else {
            this.playerBalance.removeBalance(this.betAmount); // Remove the bet amount for new hand from the player's balance
            this.hit(deck);
            this.hasDouble = true;
        }
    }


    /**
     * Calculate the chips on the hand
     * @param 
     * @returns void
     */
    public calculateChips(): void {
        let remainingBalance = this.betAmount;
        const chipStack = new Map<Chip, number>();

        for (const value of chipValues) {
            const chip = new Chip(value);
            const chipAmount = Math.floor(remainingBalance / value);
            chipStack.set(chip, chipAmount);
            remainingBalance -= chipAmount * value;
        }
        this.chips = chipStack;
    }


    /**
     * Check if the hand can stand, i.e.:
     * - the hand has not already stood
     * @param
     * @returns boolean
     */
    public canStand(): boolean {
        return !this.hasStand;
    }

    /**
     * Hand has chosen to stand
     * @param 
     * @returns void
     */
    public stand(): void {
        this.hasStand = true;
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

    public getChips(): Map<Chip, number> {
        return this.chips;
    }

    public getBalance(): Balance {
        return this.playerBalance;
    }

    public didStand(): boolean {
        return this.hasStand;
    }
}