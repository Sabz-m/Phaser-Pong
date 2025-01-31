import Phaser from "phaser";
import WebFontFile from "./WebFontFile";
import { GameBackground } from "../const/SceneKeys";
import * as Colours from "../const/Colours";

const GameState = {
  Running: "running",
  PlayerOneWon: "PlayerOneWon",
  AIWon: "ai-won",
};

export default class Game extends Phaser.Scene {
  init() {
    this.gameState = GameState.Running;
    this.aiPaddleVelocity = new Phaser.Math.Vector2(0, 0);
    this.playerOneScore = 0;
    this.aiScore = 0;
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
    this.playerOne = this.add.rectangle(250, 750, 100, 30, Colours.white, 1);
    this.physics.add.existing(this.playerOne);
    this.playerOne.body.setImmovable(true);
    this.physics.add.collider(this.playerOne, this.ball);

    // AI Paddle
    this.aiPaddle = this.add.rectangle(250, 50, 100, 30, Colours.white, 1);
    this.physics.add.existing(this.aiPaddle);
    this.aiPaddle.body.setImmovable(true);
    this.physics.add.collider(this.aiPaddle, this.ball);

    // Score Tracker
    const scoreStyle = { fontSize: 50, fontFamily: '"Press Start 2P"' };
    this.playerOneScoreLabel = this.add
      .text(50, 350, "0", scoreStyle)
      .setOrigin(0.5, 0.5);
    this.aiScoreLabel = this.add
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
      this.playerOne.x -= 10;
    } else if (this.cursors.right.isDown) {
      this.playerOne.x += 10;
    }
    if (this.playerOne.x < 50) {
      this.playerOne.x = 50;
    } else if (this.playerOne.x > 450) {
      this.playerOne.x = 450;
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
    const x = this.ball.x;
    const playerOneBounds = -50;
    const AIBounds = 850;
    if (x >= playerOneBounds && x <= AIBounds) {
      return;
    }
    if (this.ball.y < playerOneBounds) {
      this.incrementAiScore();
      this.resetBall();
    } else if (this.ball.y > AIBounds) {
      this.incrementPlayerOneScore();
      this.resetBall();
    }

    const maxScore = 1;
    if (this.playerOneScore >= maxScore) {
      console.log("player won");
      this.gameState = GameState.PlayerOneWon;
    } else if (this.aiScore >= maxScore) {
      console.log("AI won");
      this.gameState = GameState.AIWon;
    }

    if (this.gameState === GameState.Running) {
      this.resetBall();
    } else {
      this.ball.active = false;
      this.physics.world.remove(this.ball.body);
    }
  }

  incrementPlayerOneScore() {
    this.playerOneScore += 1;
    this.playerOneScoreLabel.text = this.playerOneScore;
  }

  incrementAiScore() {
    this.aiScore += 1;
    this.aiScoreLabel.text = this.aiScore;
  }

  resetBall() {
    this.ball.setPosition(250, 400);
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 400);
    this.ball.body.setVelocity(vec.y, vec.x);
  }
}
