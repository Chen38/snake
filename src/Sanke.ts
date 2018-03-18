class Snake extends egret.Sprite {

  public body: egret.Sprite;
  public bodyData: BodyNode[] = [...snakeBodyData];
  public head: egret.Shape;
  public color: number;
  private size: number = 12;
  private currentMoveDirection: MoveDirection = MoveDirection.UP;

  constructor(color: number = 0xFFFFFF) {
    super();
    this.color = color;
    this.generate(this.bodyData);
  }

  public generate(bodyData: BodyNode[]) {
    // First remove all nodes of snake
    this.removeChildren();
    let dataLen = bodyData.length;
    for(let i = 0; i < dataLen; i++) {
      let snakeBodyNode = this.drawNode(bodyData[i]);
      if (i === 0) {
        this.head = snakeBodyNode;
      }
    }
  }

  /**
   * Two situations
   *
   * // - Hit the wall
   * // - Hit it's self
   */
  public goDie() {
    this.autoMove(this.currentMoveDirection, true);
  }

  public rebirth() {
    this.currentMoveDirection = MoveDirection.UP;
    this.bodyData = [...snakeBodyData];
    this.generate(this.bodyData);
  }

  public eat(bug: BodyNode) {
    this.bodyData.unshift(bug);
  }

  public autoMove(moveDirection: MoveDirection, isDead: boolean = false) {
    if (isDead) {
      return;
    }
    if (this.currentMoveDirection === MoveDirection.LEFT && moveDirection === MoveDirection.RIGHT) {
      moveDirection = MoveDirection.LEFT;
    }
    if (this.currentMoveDirection === MoveDirection.RIGHT && moveDirection === MoveDirection.LEFT) {
      moveDirection = MoveDirection.RIGHT;
    }
    if (this.currentMoveDirection === MoveDirection.DOWN && moveDirection === MoveDirection.UP) {
      moveDirection = MoveDirection.DOWN;
    }
    if (this.currentMoveDirection === MoveDirection.UP && moveDirection === MoveDirection.DOWN) {
      moveDirection = MoveDirection.UP;
    }
    this.handleMove(moveDirection);
  }

  private handleMove(direction: MoveDirection) {
    let firstNode: BodyNode = Object.assign({}, this.bodyData[0]);
    this.currentMoveDirection = direction;

    switch (direction) {
      case 'UP':
        firstNode.y -= 12;
        break;
      case 'RIGHT':
        firstNode.x += 12;
        break;
      case 'DOWN':
        firstNode.y += 12;
        break;
      case 'LEFT':
        firstNode.x -= 12;
        break;
      default:
        break;
    }

    this.bodyData.unshift(firstNode);
    this.bodyData.pop();

    this.generate(this.bodyData);
  }

  private drawNode(pos: BodyNode): egret.Shape {
    let node: egret.Shape = new egret.Shape();
    node.x = pos.x;
    node.y = pos.y;
    node.graphics.beginFill(this.color);
    node.graphics.drawRect(0, 0, this.size, this.size);
    node.graphics.endFill();
    this.addChild(node);
    return node;
  }
}
