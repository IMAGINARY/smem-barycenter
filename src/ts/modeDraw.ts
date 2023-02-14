import { Mode } from './uiFunctions';
import { Point } from './barycenter';
import { barycenterBySurface } from './barycenter';

export default class ModeDraw implements Mode {
  ctx: CanvasRenderingContext2D;
  cnv: HTMLCanvasElement;
  drawing = false;
  lastPoint = { x: 0, y: 0 };
  stickLength = 1;
  path: Point[];
  w: number;
  h: number;

  constructor(ctx: CanvasRenderingContext2D, path: Point[]) {
    this.ctx = ctx;
    this.cnv = ctx.canvas;
    this.path = path;
    this.w = this.cnv.width;
    this.h = this.cnv.height;
  }

  activate(): void {
    const dragged = (e: PointerEvent): void => {
      if (this.drawing) {
        const d =
          (this.lastPoint.x - e.offsetX) * (this.lastPoint.x - e.offsetX) +
          (this.lastPoint.y - e.offsetY) * (this.lastPoint.y - e.offsetY);
        if (d > this.stickLength * this.stickLength) {
          this.lastPoint.x = e.offsetX;
          this.lastPoint.y = e.offsetY;
          this.path.push({ x: this.lastPoint.x, y: this.lastPoint.y });
          draw();
        }
      }
    };

    const pointedDown = () => {
      this.path = [];
      this.drawing = true;
    };

    const pointedUp = () => {
      this.drawing = false;
    };

    const draw = () => {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.ctx.beginPath();
      this.ctx.moveTo(this.path[0].x, this.path[0].y);
      for (let i = 1; i < this.path.length; i++) {
        this.ctx.lineTo(this.path[i].x, this.path[i].y);
      }
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.fillStyle = 'lightblue';
      this.ctx.fill('evenodd');
      this.ctx.closePath();
      this.ctx.stroke();

      //   const B = barycenter(path);
      const B = barycenterBySurface(this.ctx);

      this.ctx.beginPath();
      this.ctx.arc(B.x, B.y, 5, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'red';
      this.ctx.fill();
      this.ctx.stroke();
    };

    this.cnv.addEventListener('pointermove', dragged);
    this.cnv.addEventListener('pointerdown', pointedDown);
    this.cnv.addEventListener('pointerup', pointedUp);
    this.cnv.addEventListener('pointerout', pointedUp);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  deactivate(): void {}
}
