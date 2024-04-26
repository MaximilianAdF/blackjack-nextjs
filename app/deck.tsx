class DeckOfCards {
    private cards: PlayingCard[];

    constructor(size:number) {
        this.cards = [];
        this.initializeDeck(size);
    }

    private initializeDeck(size:number): void {
        for (let i = 0; i<size ; i++){
            for (let suit = 0; suit < 4; suit++) {
                for (let rank = 1; rank <= 13; rank++) {
                    this.cards.push(new PlayingCard(rank, suit));
                }
            }
        }
    }

    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard(): PlayingCard | undefined {
        return this.cards.pop();
    }

    get numberOfCards(): number {
        return this.cards.length;
    }
}

// Example usage:
const deck = new DeckOfCards(1);
deck.shuffle();
console.log("Number of cards in the deck:", deck.numberOfCards);

const drawnCard = deck.drawCard();
if (drawnCard) {
    console.log("Drawn card:", drawnCard.getCardName());
    console.log("Number of cards in the deck after drawing:", deck.numberOfCards);
} else {
    console.log("No cards left in the deck.");
}
