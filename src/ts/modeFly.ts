/* eslint-disable @typescript-eslint/no-empty-function */
import { Mode } from './uiFunctions';
import { Point, distSq, dist, lerp, slerp, clamp } from './mathHelpers';

interface dragon {
  pos: Point;
  rad: number;
}

interface wand {
  pos: Point;
  dir: Point;
  length: number;
  value: number;
  catchRadius: number;
  maxValue: number;
  acceleration: number;
  deadzone: number;
}

export default class ModeFly implements Mode {
  ctx: CanvasRenderingContext2D;
  cnv: HTMLCanvasElement;

  lastPoint = { x: 0, y: 0 };
  path: Point[];

  dragon: dragon = { pos: { x: 100, y: 100 }, rad: 10 };
  wand: wand = {
    pos: { x: 400, y: 700 },
    dir: { x: 0, y: -1 },
    length: 80,
    value: 100,
    maxValue: 50,
    catchRadius: 150,
    acceleration: 0.5,
    deadzone: 1,
  };

  drawing = false;
  stickLengthSq = 1;
  actRadiusSq = 15 * 15;
  w: number;
  h: number;

  drawDragon = () => {
    this.ctx.beginPath();
    this.ctx.arc(
      this.dragon.pos.x,
      this.dragon.pos.y,
      this.dragon.rad,
      0,
      2 * Math.PI,
    );
    this.ctx.fill();
  };

  drawWand = () => {
    this.ctx.beginPath();
    this.ctx.moveTo(this.wand.pos.x, this.wand.pos.y);

    this.ctx.lineTo(
      this.wand.pos.x + this.wand.dir.x * this.wand.value,
      this.wand.pos.y + this.wand.dir.y * this.wand.value,
    );
    console.log(this.wand.pos.x + this.wand.dir.x * this.wand.value);
    this.ctx.stroke();
  };

  updateWand = (pt: Point) => {
    console.log(this.wand);

    const d = dist(this.wand.pos, pt);
    const v = { x: pt.x - this.wand.pos.x, y: pt.y - this.wand.pos.y };

    this.wand.value = clamp(d, 0, this.wand.maxValue);
    // this.wand.value = lerp(
    //   this.wand.value,
    //   clamp(d, 0, this.wand.maxValue),
    //   this.wand.acceleration,
    // );
    if (this.wand.value < this.wand.deadzone) {
      this.wand.value = 0;
    }

    const D = d <= 0.01 ? 1 : d;
    this.wand.dir = { x: v.x / D, y: v.y / D };
  };

  // dragged = (e: PointerEvent): void => {
  //   if (this.drawing) {
  //     const d = distSq(this.lastPoint, { x: e.offsetX, y: e.offsetY });
  //     if (d > this.stickLengthSq) {
  //       this.lastPoint.x = e.offsetX;
  //       this.lastPoint.y = e.offsetY;
  //       this.path.push({ x: this.lastPoint.x, y: this.lastPoint.y });
  //       this.draw();
  //     }
  //   }
  // };

  pointedDown = (e: PointerEvent) => {
    const pt = { x: e.offsetX, y: e.offsetY };
    const d = dist(this.wand.pos, pt);
    if (d <= this.wand.catchRadius) {
      this.updateWand(pt);
      this.draw();
      console.log('within catchRadius');
    }
  };

  //   if(!recallActive & dist(mouse().xy, wand.pos) <= wand.catchRadius,
  //   wandActive = true;
  //   updateWand();
  //   updateDragon();
  //   repaint();
  // );

  //   this.drawing = true;
  // };

  // pointedUp = () => {
  //   this.drawing = false;
  // };

  // clear = () => {
  //   this.path = [];
  //   this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.width);
  // };

  draw = () => {
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
    this.drawDragon();
    this.drawWand();
  };

  constructor(ctx: CanvasRenderingContext2D, path: Point[]) {
    this.ctx = ctx;
    this.cnv = ctx.canvas;
    this.path = path;
    this.w = this.cnv.width;
    this.h = this.cnv.height;
  }

  activate(): void {
    this.drawDragon();
    this.drawWand();
    this.cnv.addEventListener('pointerdown', this.pointedDown);
  }
  deactivate(): void {}
  // activate(): void {
  //   this.cnv.addEventListener('pointermove', this.dragged);
  //   this.cnv.addEventListener('pointerdown', this.pointedDown);
  //   this.cnv.addEventListener('pointerup', this.pointedUp);
  //   this.cnv.addEventListener('pointerout', this.pointedUp);
  // }

  // deactivate(): void {
  //   this.cnv.removeEventListener('pointermove', this.dragged);
  //   this.cnv.removeEventListener('pointerdown', this.pointedDown);
  //   this.cnv.removeEventListener('pointerup', this.pointedUp);
  //   this.cnv.removeEventListener('pointerout', this.pointedUp);
  // }
}
