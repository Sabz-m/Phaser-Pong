import Phaser from "phaser";
import { TitleScreen } from "../const/SceneKeys";
import { PressStart2P } from "../const/Fonts";

export default class GameOver extends Phaser.Scene {
  create(data) {
    let titleText = "Game Over";

    if (data.playerScore > data.aiScore) {
      titleText = "You Win!";
    }

    this.add
      .text(250, 250, titleText, {
        fontFamily: PressStart2P,
        fontSize: 38,
      })
      .setOrigin(0.5);

    this.add
      .text(250, 350, "Press Space To Continue", {
        fontFamily: PressStart2P,
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start(TitleScreen);
    });
    console.dir(data);
  }
}
