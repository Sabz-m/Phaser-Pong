import Phaser from "phaser";

import Preload from "./scenes/Preload";
import TitleScreen from "./scenes/TitleScreen";
import Game from "./scenes/Game";
import GameBackground from "./scenes/GameBackground";
import GameOver from "./scenes/GameOver";
import * as SceneKeys from "./const/SceneKeys";

const config = {
  width: 500,
  height: 800,
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);

game.scene.add(SceneKeys.Preload, Preload);
game.scene.add(SceneKeys.TitleScreen, TitleScreen);
game.scene.add(SceneKeys.Game, Game);
game.scene.add(SceneKeys.GameBackground, GameBackground);
game.scene.add(SceneKeys.GameOver, GameOver);

// game.scene.start("titlescreen");
game.scene.start(SceneKeys.Preload);
