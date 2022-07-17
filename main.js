import { Game } from './game.js';
import { winConditions } from './winConditions.js';

let game = new Game();

game.addPlayer('player-0');
game.addPlayer('player-1');
game.addPlayer('player-2');
game.addPlayer('player-3');
game.addPlayer('player-4');
game.addPlayer('player-5');

game.startGame();

document.getElementById('turn').addEventListener('click', function () {
    game.play_river();
});

document.getElementById('check-winner').addEventListener('click', function () {
    console.log('checking win condition');
    for (const player of game.getPlayers()) {
        console.log(player.name);
        winConditions(game.flop, player.hand);
    }
});

for (let i = 0; i < game.playerCount; i++) {
    document
        .getElementById('player-' + i + '-fold')
        .addEventListener('click', function () {
            game.fold('player-' + i);
        });
    document
        .getElementById('player-' + i + '-call')
        .addEventListener('click', function () {
            game.call('player-' + i);
        });
    document
        .getElementById('player-' + i + '-raise')
        .addEventListener('click', function () {
            game.raise('player-' + i);
        });
}
