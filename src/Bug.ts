class Bug extends egret.Shape {

  private bugColor: number = 0xFFFFFF;
  private bugSize: number = 12;

  constructor() {
    super();
  }

  public generate(left: number, top: number) {
    this.x = left;
    this.y = top;
    this.graphics.beginFill(this.bugColor);
    this.graphics.drawRect(0, 0, this.bugSize, this.bugSize);
    this.graphics.endFill();
  }
}
