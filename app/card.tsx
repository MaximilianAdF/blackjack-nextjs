enum Suit {
    Hearts,
    Diamonds,
    Clubs,
    Spades
}

class PlayingCard {
    rank: number;
    suit: Suit;

    constructor(rank: number, suit: Suit) {
        this.rank = rank;
        this.suit = suit;
    }

    getSvgPath(): string {
        const rankString = this.rank === 1 ? "A" : this.rank === 11 ? "J" : this.rank === 12 ? "Q" : this.rank === 13 ? "K" : this.rank === 10 ? "T" :this.rank.toString();
        const suitString = Suit[this.suit].toLowerCase();
        return `${rankString}_${suitString}.svg`;
    }

    getCardName(): string {
        let rankName: string;
        switch (this.rank) {
            case 1:
                rankName = "Ace";
                break;
            case 11:
                rankName = "Jack";
                break;
            case 12:
                rankName = "Queen";
                break;
            case 13:
                rankName = "King";
                break;
            default:
                rankName = this.rank.toString();
        }

        let suitName: string;
        switch (this.suit) {
            case Suit.Hearts:
                suitName = "Hearts";
                break;
            case Suit.Diamonds:
                suitName = "Diamonds";
                break;
            case Suit.Clubs:
                suitName = "Clubs";
                break;
            case Suit.Spades:
                suitName = "Spades";
                break;
            default:
                suitName = "Unknown";
        }

        return `${rankName} of ${suitName}`;
    }
}

