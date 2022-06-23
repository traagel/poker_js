export class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    describe() {
        return (this.value + "-" + this.suit);
    }
}