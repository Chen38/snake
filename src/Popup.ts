class Popup extends egret.Sprite {

  private stageWidth: number;
  private stageHeight: number;

  constructor(stageWidth: number, stageHeight: number) {
    super();
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  }

  /**
   * Generate the popup window
   * @param {number}     width  [popup window width]
   * @param {number}     height [popup window height]
   * @param {boolean}    shouldTransformCenter [when do transition on the popup should make the transform origin in the center, default is false]
   */
  public generate(width: number, height: number, shouldTransformCenter: boolean = false) {
    this.x = this.stageWidth - width >> 1;
    this.y = this.stageHeight - height >> 1;

    if (shouldTransformCenter) {
      this.anchorOffsetX = width >> 1;
      this.anchorOffsetY = height >> 1;
      this.x = this.stageWidth >> 1;
      this.y = this.stageHeight >> 1;
    }

    this.graphics.beginFill(0xFFFFFF, 0.6);
    this.graphics.lineStyle(4, 0xFFFFFF);
    this.graphics.drawRect(0, 0, width, height);
    this.graphics.endFill();

  }

}
