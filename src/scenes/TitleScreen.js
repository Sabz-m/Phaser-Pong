import Phaser from "phaser";
import WebFontFile from "./WebFontFile";
import { Game } from "../const/SceneKeys";
import { PressStart2P } from "../const/Fonts";

export default class TitleScreen extends Phaser.Scene {
  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
  }

  create() {
    const title = this.add.text(250, 250, "Sabiri's Pong", {
      fontSize: 30,
      fontFamily: PressStart2P,
    });
    title.setOrigin(0.5, 0.5);

    this.add
      .text(250, 350, "Press Space to Start", {
        fontSize: 15,
        fontFamily: PressStart2P,
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start(Game);
    });
  }
}
