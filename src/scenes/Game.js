import Phaser from "phaser";
import WebFontFile from "./WebFontFile";
import { GameBackground, GameOver } from "../const/SceneKeys";
import * as Colours from "../const/Colours";
import { PressStart2P } from "../const/Fonts";

const GameState = {
  Running: "running",
  BottomPlayerWon: "bottomPlayerWon",
  AIWon: "ai-won",
};

export default class Game extends Phaser.Scene {
  init() {
    this.gameState = GameState.Running;
    this.aiPaddleVelocity = new Phaser.Math.Vector2(0, 0);
    this.bottomPlayerScore = 0;
    this.topPlayerScore = 0;
    this.paused = false;
  }

  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
  }

  create() {
    // Background
    this.scene.run(GameBackground);
    this.scene.sendToBack(GameBackground);
    // Bounds
    this.physics.world.setBounds(0, -100, 500, 1000);
    // ball
    this.ball = this.add.circle(250, 400, 10, Colours.white, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setCircle(10);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setCollideWorldBounds(true, 1, 1);

    this.time.delayedCall(1500, () => {
      this.resetBall();
    });

    // Player One Paddle
    this.bottomPlayer = this.add.rectangle(250, 750, 100, 30, Colours.white, 1);
    this.physics.add.existing(this.bottomPlayer);
    this.bottomPlayer.body.setImmovable(true);
    this.physics.add.collider(this.bottomPlayer, this.ball);

    // AI Paddle
    this.aiPaddle = this.add.rectangle(250, 50, 100, 30, Colours.white, 1);
    this.physics.add.existing(this.aiPaddle);
    this.aiPaddle.body.setImmovable(true);
    this.physics.add.collider(this.aiPaddle, this.ball);

    // Score Tracker
    const scoreStyle = { fontSize: 50, fontFamily: PressStart2P };
    this.bottomPlayerScoreLabel = this.add
      .text(50, 350, "0", scoreStyle)
      .setOrigin(0.5, 0.5);
    this.topPlayerScoreLabel = this.add
      .text(50, 450, "0", scoreStyle)
      .setOrigin(0.5, 0.5);

    // // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.paused || this.gameState !== GameState.Running) {
      return;
    }
    this.handlePlayerInput();
    this.updateAI();
    this.checkscore();
  }

  handlePlayerInput() {
    if (this.cursors.left.isDown) {
      this.bottomPlayer.x -= 10;
    } else if (this.cursors.right.isDown) {
      this.bottomPlayer.x += 10;
    }
    if (this.bottomPlayer.x < 50) {
      this.bottomPlayer.x = 50;
    } else if (this.bottomPlayer.x > 450) {
      this.bottomPlayer.x = 450;
    }
  }

  updateAI() {
    const aiSpeed = 3;
    const diff = this.ball.x - this.aiPaddle.x;
    if (Math.abs(diff) < 10) {
      return;
    }
    if (diff < 0) {
      this.aiPaddleVelocity.x = -aiSpeed;
      if (this.aiPaddleVelocity.x < -10) {
        this.aiPaddleVelocity.x = -10;
      }
    } else if (diff > 0) {
      this.aiPaddleVelocity.x = aiSpeed;
      if (this.aiPaddleVelocity.x > 10) {
        this.aiPaddleVelocity.x = 10;
      }
    }
    this.aiPaddle.x += this.aiPaddleVelocity.x;
  }

  checkscore() {
    const y = this.ball.y;
    console.log(y);
    const bottomPlayerBounds = 850;
    const topPlayerBounds = -50;
    if (y <= bottomPlayerBounds && y >= topPlayerBounds) {
      return;
    }
    if (this.ball.y > bottomPlayerBounds) {
      this.incrementTopPlayerScore();
    } else if (this.ball.y < topPlayerBounds) {
      this.incrementBottomPlayerScore();
    }

    const maxScore = 2;
    if (this.bottomPlayerScore >= maxScore) {
      console.log("player won");
      this.gameState = GameState.BottomPlayerWon;
    } else if (this.topPlayerScore >= maxScore) {
      console.log("AI won");
      this.gameState = GameState.TopPlayerWon;
    }

    if (this.gameState === GameState.Running) {
      this.resetBall();
    } else {
      this.ball.active = false;
      this.physics.world.remove(this.ball.body);

      this.scene.stop(GameBackground);

      this.scene.start(GameOver, {
        playerScore: this.bottomPlayerScore,
        aiScore: this.topPlayerScore,
      });
    }
  }

  incrementBottomPlayerScore() {
    this.bottomPlayerScore += 1;
    this.bottomPlayerScoreLabel.text = this.bottomPlayerScore;
  }

  incrementTopPlayerScore() {
    this.topPlayerScore += 1;
    this.topPlayerScoreLabel.text = this.topPlayerScore;
  }

  resetBall() {
    this.ball.setPosition(250, 400);
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 600);
    this.ball.body.setVelocity(vec.y, vec.x);
  }
}
