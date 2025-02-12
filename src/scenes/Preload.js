import Phaser from "phaser";
import WebFontFile from "./WebFontFile";
import { TitleScreen } from "../const/SceneKeys";
import { PressStart2P } from "../const/Fonts";

export default class Preload extends Phaser.Scene {
  preload() {
    console.log("preload screen title screen creat");

    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
  }

  create() {
    console.log("preload screen title screen creat");
    this.scene.start(TitleScreen);
  }
}
