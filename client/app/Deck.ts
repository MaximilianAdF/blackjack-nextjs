import { Card } from './Card';

export class Deck {
    private deckOfCards: Card[]

    constructor(numDecks: number = 1) {
        this.deckOfCards = [];
        this.createDeck(Math.min(numDecks, 8));
    }

    /**
     * Create a deck of cards
     * @param numDecks - number of 52-card decks used to create the deck
     * @returns void
     */
    private createDeck(numDecks: number): void {
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        const suits = ['H', 'D', 'C', 'S'];
        for (let i = 0; i < numDecks; i++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    this.deckOfCards.push(new Card(rank+suit));
                }
            }
        }
        this.shuffleDeck();
    }

    /**
     * Shuffle the deck of cards
     * @returns void
     */
    public shuffleDeck(): void {
        for (let i = this.deckOfCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deckOfCards[i], this.deckOfCards[j]] = [this.deckOfCards[j], this.deckOfCards[i]];
        }
    }

    /**
     * Deal a card from the deck
     * @returns Card | undefined
     */
    public dealCard(): Card | undefined {
        return this.deckOfCards.pop();
    }
    
    /**
     * Get the number of cards in the deck
     * @returns number
     */
    public getNumCards(): number {
        return this.deckOfCards.length;
    }
}
