import Phaser from "phaser";

export default class GameBackground extends Phaser.Scene {
  preload() {}

  create() {
    const whiteColour = 0xffffff;
    this.add.line(250, 400, 500, 0, 0, 0, whiteColour, 1).setLineWidth(5);

    this.add.circle(250, 400, 50).setStrokeStyle(5, whiteColour);
  }
}
