import {Game} from './game.js';

let game = new Game();

game.addPlayer("player-1");
game.addPlayer("player-2");
game.addPlayer("player-3");
game.addPlayer("player-4");

game.startGame();
document.getElementById("turn").addEventListener("click", function() {game.play_river();});
