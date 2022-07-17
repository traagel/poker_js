export class Deck {
  constructor() {
    this.deck = this.create();
  }

  create() {
    let deck = [];
    let suits = ["H", "C", "S", "D"]; //Hearts Clubs Spades Diamonds
    let values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    for (let i = 0; i < 4; i++) {
      //4
      for (let j = 0; j < 13; j++) {
        // 13 cards
        deck.push(new Card(suits[i], values[j]));
      }
    }
    return deck;
  }

  show() {
    for (const card of this.deck) {
      console.log(card.describe());
    }
  }

  shuffle() {
    //Durstenfeld shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    for (let i = 0; i < this.deck.length; i++) {
      let j = Math.floor(Math.random() * this.deck.length);
      let temp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = temp;
    }
    console.log("shuffled deck");
  }

  getCard() {
    return this.deck.pop();
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  describe() {
    return this.value + "-" + this.suit;
  }

  getSuit() {
    return this.suit;
  }

  getValue() {
    return this.value;
  }
}
