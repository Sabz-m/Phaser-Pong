import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  init() {
    this.aiPaddleVelocity = new Phaser.Math.Vector2(0, 0);
    this.playerOneScore = 0;
    this.aiScore = 0;
  }

  preload() {}

  create() {
    // Bounds
    this.physics.world.setBounds(0, -100, 500, 1000);
    // ball
    this.ball = this.add.circle(250, 400, 10, 0xffffff, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.resetBall();

    // Player One Paddle
    this.playerOne = this.add.rectangle(250, 750, 100, 30, 0xffffff, 1);
    this.physics.add.existing(this.playerOne);
    this.playerOne.body.setImmovable(true);
    this.physics.add.collider(this.playerOne, this.ball);

    // AI Paddle
    this.aiPaddle = this.add.rectangle(250, 50, 100, 30, 0xffffff, 1);
    this.physics.add.existing(this.aiPaddle);
    this.aiPaddle.body.setImmovable(true);
    this.physics.add.collider(this.aiPaddle, this.ball);

    // Score Tracker
    const scoreStyle = { fontSize: 50 };
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
    //Left paddle movement
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

    // aiPaddle movement
    const aiSpeed = 0.1;
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
    if (this.ball.y < -50) {
      this.incrementAiScore();
      this.resetBall();
    } else if (this.ball.y > 850) {
      this.incrementPlayerOneScore();
      this.resetBall();
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
