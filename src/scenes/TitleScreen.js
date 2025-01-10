import Phaser from "phaser";

export default class TitleScreen extends Phaser.Scene {
  preload() {}

  create() {
    const text = this.add.text(250, 400, "Hello, World!");
    text.setOrigin(0.5, 0.5);
  }
}
