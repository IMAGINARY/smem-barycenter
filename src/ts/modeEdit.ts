import { Point, Layer, Mode } from './layer';
import { dist } from './mathHelpers';

// Hardcoded parameters

// const stickLengthSq = 0.5;
// const actRadiusSq = 60 * 60; // activation radius squared
const nodeRadius = 5;

class ModeEdit implements Mode {
  layer: Layer;
  isMoving = false;
  basePoint: Point = { x: 0, y: 0 };
  selectedPoints: Point[] = [];

  constructor(layer: Layer) {
    this.layer = layer;
  }

  render = () => {
    this.layer.clear();
    this.layer.drawPath();
    this.layer.computeBarycenter();
    this.layer.drawBarycenter();
    this.layer.path.data.forEach((p) => {
      const ctx = this.layer.ctx;
      ctx.beginPath();
      ctx.fillStyle = '#ffffff11';
      ctx.arc(p.x, p.y, nodeRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    });
  };

  selectPoints(p: Point) {
    console.log('selecting', p);
    this.selectedPoints = this.layer.path.data.filter(
      (x) => dist(p, x) < nodeRadius,
    );
    // // Uncomment to select close nodes
    // if (this.selectedPoints.length === 0) {
    //   this.selectedPoints = this.layer.path.data.filter(
    //     (x) => dist(p, x) < 3 * nodeRadius,
    //   );
    // }
    if (this.selectedPoints.length === 0) {
      const color = this.layer.ctx.getImageData(p.x, p.y, 1, 1).data;
      if (color[3] !== 0) {
        this.selectedPoints = this.layer.path.data;
      }
    }
  }

  pointedDown = (e: PointerEvent) => {
    if (e.isPrimary) {
      this.basePoint = { x: e.offsetX, y: e.offsetY } as Point;
      this.selectPoints(this.basePoint);
      this.isMoving = true;
    }
  };
  pointedUp = () => {
    this.isMoving = false;
  };

  dragged = (e: PointerEvent) => {
    if (this.isMoving && e.isPrimary) {
      const displacement = {
        vx: e.offsetX - this.basePoint.x,
        vy: e.offsetY - this.basePoint.y,
      };

      this.selectedPoints.forEach((d) => {
        d.x += displacement.vx;
        d.y += displacement.vy;
      });
      this.basePoint = { x: e.offsetX, y: e.offsetY } as Point;
      this.render();
    }
  };

  activate(): void {
    console.log('modeEdit activated');
    this.layer.activate();
    this.layer.cnv.addEventListener('pointermove', this.dragged);
    this.layer.cnv.addEventListener('pointerdown', this.pointedDown);
    this.layer.cnv.addEventListener('pointerup', this.pointedUp);
    this.layer.cnv.addEventListener('pointerout', this.pointedUp);
    this.render();
  }

  deactivate(): void {
    this.layer.clear();
    this.layer.render();
    this.layer.deactivate();

    this.layer.cnv.removeEventListener('pointermove', this.dragged);
    this.layer.cnv.removeEventListener('pointerdown', this.pointedDown);
    this.layer.cnv.removeEventListener('pointerup', this.pointedUp);
    this.layer.cnv.removeEventListener('pointerout', this.pointedUp);
  }
}

export { ModeEdit };
