import { Game } from "./game.js";

let game = new Game();

game.addPlayer("player-0");
game.addPlayer("player-1");
game.addPlayer("player-2");
game.addPlayer("player-3");

game.startGame();

document.getElementById("turn").addEventListener("click", function () {
  game.play_river();
});

for (let i = 0; i < game.playerCount; i++) {
    document
    .getElementById("player-" + i + "-fold")
    .addEventListener("click", function () {
      game.fold("player-" + i);
    });
    document
    .getElementById("player-" + i + "-call")
    .addEventListener("click", function () {
        game.call("player-" + i);
    });
}
