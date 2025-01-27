import Phaser from "phaser";
import * as Colours from "../const/Colours";

export default class GameBackground extends Phaser.Scene {
  preload() {}

  create() {
    this.add.line(250, 400, 500, 0, 0, 0, Colours.white, 1).setLineWidth(5);
    this.add.circle(250, 400, 50).setStrokeStyle(5, Colours.white);
  }
}
