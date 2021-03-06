export class Player {
  constructor(name, money) {
    this.name = name;
    this.money = money;
    this.hand = [];
    this.cardsInHand = 0;
    this.Bet = 0;
    this.status = "";
    this.blind = "";
  }

  addCard(card) {
    if (this.cardsInHand < 2) {
      this.hand.push(card);
      this.cardsInHand = this.hand.length;
      console.log(this.name + " got " + card.describe());
    } else {
      throw new Error("Already has 2 cards");
    }
  }

  printCards() {
    console.log(this.hand[0].describe() + "," + this.hand[1].describe());
  }

  getCards() {
    return this.hand;
  }

  showMoney() {
    return this.money;
  }

  clearHand() {
    this.hand = [];
  }

  placeBet(amount) {
    if (amount <= this.money) {
      this.currentBet = amount;
      this.money -= amount;
    }
  }

  getName() {
    return this.name;
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  addMoney(amount){
    this.money += amount;
  }

  removeMoney(amount){
    this.money -= amount;
  }

}
