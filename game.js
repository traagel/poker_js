import { Deck } from './deck.js';
import { Player } from './player.js';

export class Game {
    constructor() {
        this.rounds = 0;
        this.smallBlindId = 0;
        this.bigBlind = 2; // temp value - should use smallBlind + 1
        this.smallBlind = 0;
        this.players = [];
        this.playerCount = 0;
        this.pot = 0;
        this.deck = new Deck();
        this.bigBlindAmount = 2;
        this.smallBlindAmount = this.bigBlindAmount / 2;
        this.startingMoney = 1500;
        this.playOrder = [];
        this.flop = [];
        this.biggestBet = this.bigBlindAmount;
    }

    addPlayer(playerName) {
        let newPlayer = new Player(playerName, this.startingMoney);
        this.players.push(newPlayer);
        this.smallBlindId = this.playerCount - 1;
        this.playerCount += 1;
        console.log('player ' + playerName + ' added.');
        let ul = document.getElementById('player-list');
        let li = document.createElement('li');
        li.id = 'li-' + playerName;
        li.appendChild(document.createTextNode(playerName));
        ul.appendChild(li);
    }

    removePlayer(player) {
        this.players = this.players.filter((e) => e !== player);
    }

    startGame() {
        if (this.playerCount > 1) {
            this.smallBlind = this.players[this.smallBlindId];
            this.bigBlind = this.players[this.getBigBlindId()];
            console.log('Starting game.');
            console.log('We have ' + this.playerCount + ' players');
            console.log('Small blind ID:' + this.smallBlindId);
            console.log('Small blind is ' + this.smallBlind.getName());
            console.log('Big blind is ' + this.bigBlind.getName());
            // game logic
            this.deck.shuffle();
            this.updateOrder();

            // deal player cards
            for (let i = 0; i < 2; i++) {
                for (const player of this.playOrder) {
                    // console.log(player);
                    player.addCard(this.deck.getCard());
                }
            }

            //draw cards
            this.setBlindPot();
            this.drawCards();
            this.updatePot();

            // deal to flop - burn a card
            console.log('burned ' + this.deck.getCard().describe());
            for (let i = 0; i < 3; i++) {
                this.flop.push(this.deck.getCard());
            }
            for (const card of this.flop) {
                let ul = document.getElementById('flop-list');
                let cardImg = document.createElement('img');
                cardImg.src = './cards/' + card.describe() + '.png';

                ul.appendChild(cardImg);
            }
        }
    }

    drawCards() {
        for (const player of this.playOrder) {
            console.log(player.getName());
            player.printCards();
            let el = document.createElement('ul');
            let id_name = player.getName() + '-cards';
            el.id = id_name;
            let rNode = document.getElementById('li-' + player.getName());
            rNode.parentNode.insertBefore(el, rNode.nextSibling);

            let i = 0;
            for (const card of player.getCards()) {
                let ul = document.getElementById(id_name);
                let li = document.createElement('li');
                li.id = 'card-' + i;
                let cardImg = document.createElement('img');
                cardImg.src = './cards/' + card.describe() + '.png';
                li.appendChild(cardImg);
                ul.appendChild(li);
                i += 1;
            }

            let btn_fold = document.createElement('button');
            let btn_check = document.createElement('button');
            let btn_call = document.createElement('button');
            let btn_raise = document.createElement('button');

            btn_fold.id = player.getName() + '-fold';
            btn_check.id = player.getName() + '-check';
            btn_call.id = player.getName() + '-call';
            btn_raise.id = player.getName() + '-raise';

            btn_fold.innerText = 'Fold';
            btn_check.innerText = 'Check';
            btn_call.innerText = 'Call';
            btn_raise.innerText = 'Raise';

            const textBox = document.createElement('input');
            textBox.setAttribute('type', 'text');
            textBox.id = player.getName() + '-raiseBox';

            el.appendChild(document.createElement('p'));
            el.appendChild(btn_fold);
            el.appendChild(btn_check);
            el.appendChild(btn_call);
            el.appendChild(textBox);
            el.appendChild(btn_raise);
            el.appendChild(document.createElement('p'));

            this.updatePlayerMoney(player);
        }
    }

    updatePlayerMoney(player) {
        {
            let id = document.getElementById('li-' + player.getName());
            if (player === this.bigBlind) {
                id.innerText =
                    player.getName() +
                    ', $' +
                    player.showMoney() +
                    ', Big blind';
            } else if (player === this.smallBlind) {
                id.innerText =
                    player.getName() +
                    ', $' +
                    player.showMoney() +
                    ', Small blind';
            } else {
                id.innerText = player.getName() + ', $' + player.showMoney();
            }
        }
    }

    getBigBlindId() {
        if (this.smallBlindId === this.playerCount) {
            return 0;
        } else {
            return this.smallBlindId + 1;
        }
    }

    updateOrder() {
        this.playOrder = this.players
            .slice(this.getBigBlindId())
            .concat(this.players.slice(0, this.getBigBlindId()));

        console.log('test');
    }

    play_river() {
        if (this.flop.length < 5) {
            let card = this.deck.getCard();
            this.flop.push(card);
            let ul = document.getElementById('flop-list');
            let cardImg = document.createElement('img');
            cardImg.src = './cards/' + card.describe() + '.png';

            ul.appendChild(cardImg);
        }
    }

    fold(player) {
        this.disableButtons(player);

        player = this.players[player.split('-')[1]];
        player.setStatus('Fold');
    }

    check(player) {
        this.disableButtons(player);

        player = this.players[player.split('-')[1]];
        player.setStatus('Check');
    }

    call(player) {
        this.disableButtons(player);
        player = this.players[player.split('-')[1]];
        if (
            player.blind === 'small' &&
            player.Bet < this.biggestBet &&
            player.money >= this.biggestBet
        ) {
            this.pot += this.bigBlindAmount / 2;
            player.removeMoney(this.bigBlindAmount / 2);
        } else if (
            player.Bet < this.biggestBet &&
            player.money >= this.biggestBet &&
            player.blind !== 'big'
        ) {
            this.pot += this.biggestBet;
            player.removeMoney(this.biggestBet);
        }
        this.updatePot();
        this.updatePlayerMoney(player);
    }

    raise(player) {
        const boxId = player + '-raiseBox';
        const raiseAmount = parseInt(document.getElementById(boxId).value);
        if (raiseAmount > this.players[player.split('-')[1]].money) {
            return;
        }
        this.disableButtons(player);

        console.log(boxId);

        console.log(raiseAmount);
        player = this.players[player.split('-')[1]];
        player.removeMoney(raiseAmount);
        this.pot += raiseAmount;

        this.updatePot();
        this.updatePlayerMoney(player);
    }

    getPlayers() {
        return this.players;
    }

    disableButtons(player) {
        document.getElementById(player + '-fold').disabled = true;
        document.getElementById(player + '-check').disabled = true;
        document.getElementById(player + '-raise').disabled = true;
        document.getElementById(player + '-call').disabled = true;
        document.getElementById(player + '-raiseBox').disabled = true;
    }

    setBlindPot() {
        this.bigBlind.removeMoney(this.bigBlindAmount);
        this.bigBlind.blind = 'big';
        this.smallBlind.removeMoney(this.smallBlindAmount);
        this.smallBlind.blind = 'small';
        this.pot += this.bigBlindAmount + this.smallBlindAmount;
    }

    updatePot() {
        document.getElementById('pot-size').innerText =
            'Pot size: $' + this.pot;
    }
}
