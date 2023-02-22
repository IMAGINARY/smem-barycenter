import { Mode } from './uiFunctions';
import { Point } from './barycenter';
import { barycenterBySurface } from './barycenter';

const distSq = (ptA: Point, ptB: Point): number =>
  (ptA.x - ptB.x) * (ptA.x - ptB.x) + (ptA.y - ptB.y) * (ptA.y - ptB.y);

export default class ModeDraw implements Mode {
  ctx: CanvasRenderingContext2D;
  cnv: HTMLCanvasElement;
  drawing = false;
  lastPoint = { x: 0, y: 0 };
  stickLengthSq = 1;
  actRadiusSq = 15 * 15;
  path: Point[];
  w: number;
  h: number;

  dragged = (e: PointerEvent): void => {
    if (this.drawing) {
      const d = distSq(this.lastPoint, { x: e.offsetX, y: e.offsetY });
      if (d > this.stickLengthSq) {
        this.lastPoint.x = e.offsetX;
        this.lastPoint.y = e.offsetY;
        this.path.push({ x: this.lastPoint.x, y: this.lastPoint.y });
        this.draw();
      }
    }
  };

  pointedDown = (e: PointerEvent) => {
    const d = distSq(this.lastPoint, { x: e.offsetX, y: e.offsetY });
    if (d > this.actRadiusSq) {
      this.path = [];
      this.clear();
    }

    this.drawing = true;
  };

  pointedUp = () => {
    this.drawing = false;
  };

  clear = () => {
    this.path = [];
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.width);
  };

  draw = () => {
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
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

  constructor(ctx: CanvasRenderingContext2D, path: Point[]) {
    this.ctx = ctx;
    this.cnv = ctx.canvas;
    this.path = path;
    this.w = this.cnv.width;
    this.h = this.cnv.height;
  }

  activate(): void {
    this.cnv.addEventListener('pointermove', this.dragged);
    this.cnv.addEventListener('pointerdown', this.pointedDown);
    this.cnv.addEventListener('pointerup', this.pointedUp);
    this.cnv.addEventListener('pointerout', this.pointedUp);
  }

  deactivate(): void {
    this.cnv.removeEventListener('pointermove', this.dragged);
    this.cnv.removeEventListener('pointerdown', this.pointedDown);
    this.cnv.removeEventListener('pointerup', this.pointedUp);
    this.cnv.removeEventListener('pointerout', this.pointedUp);
  }
}
