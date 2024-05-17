import { Chip } from './Chip';
export const chipValues: number[] = [5000, 1000, 100, 50, 25, 10, 5, 1];


export class Balance {
    private chipStack: Map<Chip, number>;
    private value: number;

    constructor(initialBalance: number) {
        this.value = initialBalance;
        this.chipStack = new Map();
        this.calculateChipStack();
    }
    
    /**
     * Mehtod for calculating the chip stack based on the user's balance
     * @returns void
     */
    public calculateChipStack(): void {
        let remainingBalance = this.value;
        this.chipStack.clear();

        for (const value of chipValues) {
            const chip = new Chip(value);
            const amount = Math.floor(remainingBalance / value);
            this.chipStack.set(chip, amount);
            remainingBalance -= amount * value;
        }
    }

    /**
     * Add specfic amount of chips of a specific type to the user's chip stack
     * @param chip 
     * @param amount 
     */
    public addChips(chip: Chip, amount: number): void {
        const currentAmount = this.chipStack.get(chip) || 0;
        this.chipStack.set(chip, currentAmount + amount);
    }

    /**
     * Remove specific amount of chips of a specific type from the user's chip stack
     * @param chip 
     * @param amount 
     * @throws Error if there are not enough chips to remove
     */
    public removeChips(chip: Chip, amount: number): void {
        const currentAmount = this.chipStack.get(chip) || 0;
        if (currentAmount >= amount) {
            this.chipStack.set(chip, currentAmount - amount);
        } else {
            throw new Error('Not enough chips to remove');
        }
    }

    /**
     * Remove specific amount of bal and chips from a player chip stack
     * @param amount 
     * @throws Error if there are not enough bal to remove
     */
    public removeBalance(amount:number): void {
        if (amount <= this.value) {
            this.value -= amount;
            this.calculateChipStack();
        } else {
            throw new Error('Not enough balance');
        }
    }

    /**
     * Add specific amount of balance and chips to a player's chip stack
     * @param amount 
     */
    public addBalance(amount: number): void {
        this.value += amount;
        this.calculateChipStack();
    }


    /**
     * Method to get the amount of chips of a specific type in the user's chip stack
     * @param chip
     * @returns number
     */
    public getChipAmount(chip: Chip): number {
        return this.chipStack.get(chip) || 0;
    }


    // Method to get the total value of the user's chip stack
    public getValue(): number {
        return this.value;
    }
    
    // Method to update player balance
    public updateBalance(amount: number): void {
        this.value = amount;
        this.calculateChipStack();
    }
}