export class Card {
    private cardName: string;
    private svgPath: string;
    private value: number;
    private rank: string;
    private suit: string;

    // Receives a string with the rank and suit of the card e.g. '2H' for 2 of Hearts
    constructor(rankSuit: string) {
        this.svgPath = '../assets/cards/' + rankSuit + '.svg';
        this.rank = rankSuit[0];
        this.suit = rankSuit[1];
        this.value = this.cardValue(this.rank);
        this.cardName = this.extendedRank(this.rank) + ' of ' + this.extendedSuit(this.suit);
    }

    // Returns the written out suit of the card
    private extendedSuit(suit: string): string {
        switch (suit) {
            case 'H':
                return 'Hearts';
            case 'D':
                return 'Diamonds';
            case 'C':
                return 'Clubs';
            case 'S':
                return 'Spades';
            default:
                return 'Invalid suit';
        }
    }

    // Returns the written out rank of the card
    private extendedRank(rank: string): string {
        switch (rank) {
            case 'A':
                return 'Ace';
            case 'K':
                return 'King';
            case 'Q':
                return 'Queen';
            case 'J':
                return 'Jack';
            case 'T':
                return 'Ten';
            default:
                return rank;
        }
    }

    // Returns the value of the card
    private cardValue(rank: string): number {
        switch (rank) {
            case 'A':
                return 11;
            case 'K':
                return 10;
            case 'Q':
                return 10;
            case 'J':
                return 10;
            case 'T':
                return 10;
            default:
                return parseInt(rank);
        }
    }

    getCardName(): string {
        return this.cardName;
    }

    getSvgPath(): string {
        return this.svgPath;
    }

    getValue(): number {
        return this.value;
    }

    getRank(): string {
        return this.rank;
    }

    getSuit(): string {
        return this.suit;
    }
}
