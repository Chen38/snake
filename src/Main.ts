class Main extends egret.DisplayObjectContainer {

  private canvasWidth: number;
  private canvasHeight: number;
  private bug: Bug;
  private snake: Snake;
  private currentSnakeMoveDirection: MoveDirection = MoveDirection.UP;
  private speedControlThreshold: number = 5;
  private isSnakeDead: boolean = false;
  private dieWindow: Popup;
  // private socket = io('http://192.168.1.104:4200');

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  }

  private onAddToStage(event: egret.Event) {
    let count = 0;

    egret.lifecycle.addLifecycleListener((context) => {
      context.onUpdate = () => {
        count++;
        if (count >= this.speedControlThreshold) {
          this.snakeGo();
          count = 0;
        }
      }
    });

    egret.lifecycle.onPause = () => {
      egret.ticker.pause();
    }

    egret.lifecycle.onResume = () => {
      egret.ticker.resume();
    }

    this.canvasWidth = this.stage.stageWidth;
    this.canvasHeight = this.stage.stageHeight;

    this.generateBg();

    this.generateSnake();
    this.randomGenerateFood();

    this.generateDieWindow();
    this.controlSnakeMove();

  }

  private generateBg() {
    let canvasBg: egret.Shape = new egret.Shape();
    canvasBg.graphics.beginFill(0x000000);
    canvasBg.graphics.drawRect(0, 0, this.canvasWidth, this.canvasHeight);
    canvasBg.graphics.endFill();
    this.addChild(canvasBg);
  }

  private randomGenerateFood() {
    if (this.bug) {
      this.removeChild(this.bug);
      this.bug = null;
    }
    this.bug = new Bug();
    let bugLeft = Math.floor(Math.random() * (this.canvasWidth - 12) / 12) * 12;
    let bugTop = Math.floor(Math.random() * (this.canvasHeight - 12) / 12) * 12;
    this.bug.generate(bugLeft, bugTop);
    this.addChild(this.bug);
  }

  private generateSnake() {
    this.snake = new Snake();
    this.snake.x = 0;
    this.snake.y = 0;
    this.snake.width = this.canvasWidth;
    this.snake.height = this.canvasHeight;
    this.addChild(this.snake);
  }

  private controlSnakeMove() {
    let keyDownTimer = null;

    document.body.addEventListener('keydown', (e) => {
      this.removeChild(this.snake);
      let { keyCode } = e;
      switch (keyCode) {
        // Up
        case 38:
        case 87:
          this.currentSnakeMoveDirection = MoveDirection.UP;
          break;
        // Right
        case 39:
        case 68:
          this.currentSnakeMoveDirection = MoveDirection.RIGHT;
          break;
        // Dwon
        case 40:
        case 83:
          this.currentSnakeMoveDirection = MoveDirection.DOWN;
          break;
        // Left
        case 37:
        case 65:
          this.currentSnakeMoveDirection = MoveDirection.LEFT;
          break;
        // Restart
        case 32:
          this.restart();
          break;
        default:
          break;
      }
      this.addChild(this.snake);

      clearTimeout(keyDownTimer);
      keyDownTimer = setTimeout(() => {
        this.speedControlThreshold = 0;
      }, 300);

    }, false);

    document.body.addEventListener('keyup', (e) => {
      this.speedControlThreshold = 5;
      clearTimeout(keyDownTimer);
    }, false);
  }

  private snakeGo() {

    if (this.isSnakeDead) {
      return;
    }

    if (this.hitWallTest() || this.hitSnakeSelfTest()) {
      this.gameOver();
      return;
    }


    this.removeChild(this.snake);

    if (this.hitBugTest(this.bug)) {
      this.snake.eat({ x: this.bug.x, y: this.bug.y });
      this.randomGenerateFood();
    }

    this.snake.autoMove(this.currentSnakeMoveDirection);
    this.addChild(this.snake);
  }

  private hitBugTest(target: egret.Shape): boolean {
    return (this.snake.head.hitTestPoint(target.x + 1, target.y + 1) ||
            this.snake.head.hitTestPoint(target.x + target.width - 1, target.y + 1) ||
            this.snake.head.hitTestPoint(target.x + 1, target.y + target.height - 1) ||
            this.snake.head.hitTestPoint(target.x + target.width - 1, target.y + target.height - 1));
  }

  private hitWallTest() {
    if (this.snake.head.x <= 0 || this.snake.head.y <= 0 || this.snake.head.x >= this.canvasWidth || this.snake.head.y >= this.canvasHeight) {
      return true;
    }
    return false;
  }

  private hitSnakeSelfTest() {
    let { x, y } = this.snake.head;
    let headNode = { x, y };
    let bodyData = [...this.snake.bodyData];
    let isDead = false;
    bodyData.shift();

    // TODO: Can be imporved
    bodyData.forEach((item: BodyNode, index: number) => {
      let { x, y } = item;
      if (x === headNode.x && y === headNode.y) {
        isDead = true;
      }
    });

    return isDead;
  }

  private gameOver() {
    this.snake.goDie();
    if (!this.isSnakeDead) {
      this.isSnakeDead = true;
      this.addDieWindow(() => {
        egret.ticker.pause();
      });
    }
  }

  private restart() {
    if (!this.isSnakeDead) {
      return;
    }

    this.isSnakeDead = false;
    this.currentSnakeMoveDirection = MoveDirection.UP;
    this.speedControlThreshold = 5;
    this.stage.removeChild(this.dieWindow);
    this.snake.rebirth();
    this.addChild(this.snake);
    this.randomGenerateFood();
    this.resetDieWindow();

    egret.ticker.resume();

  }

  private generateDieWindow() {
    let width = 300;
    let height = 200;
    this.dieWindow = new Popup(this.canvasWidth, this.canvasHeight);
    this.resetDieWindow();
    this.dieWindow.generate(width, height, true);
    // Window elements
    let label: egret.TextField = new egret.TextField();
    label.text = 'You Die!!!';
    label.fontFamily = 'Menlo';
    label.x = width - label.textWidth >> 1;
    label.y = height - label.textHeight >> 1;
    this.dieWindow.addChild(label);
  }

  private resetDieWindow() {
    this.dieWindow.scaleX = 0;
    this.dieWindow.scaleY = 0;
  }

  private addDieWindow(cb?: () => void) {
    this.stage.addChild(this.dieWindow);
    egret.Tween.get(this.dieWindow)
      .to({scaleX: 1, scaleY: 1}, 600, egret.Ease.elasticOut)
      .call(cb);
  }

}
