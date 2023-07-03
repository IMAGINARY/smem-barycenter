import { Point, Layer, Mode } from './layer';
import { distSq } from './mathHelpers';

// Hardcoded parameters
const stickLengthSq = 0.5;
const actRadiusSq = 60 * 60; // activation radius squared

class ModeDraw implements Mode {
  layer: Layer;
  isPressed = false;
  lastPoint: Point;

  constructor(layer: Layer) {
    this.layer = layer;
    this.lastPoint = { x: 0, y: 0 };
  }

  pointedDown = (e: PointerEvent) => {
    if (e.isPrimary) {
      const p = { x: e.offsetX, y: e.offsetY };
      this.layer.path.data.push(p);
      console.log('pushed', p);
      this.layer.render();
    }
    this.isPressed = true;
  };

  dragged = (e: PointerEvent): void => {
    if (this.isPressed && e.isPrimary) {
      const d = distSq(this.lastPoint, { x: e.offsetX, y: e.offsetY });
      if (d > stickLengthSq) {
        this.lastPoint.x = e.offsetX;
        this.lastPoint.y = e.offsetY;
        this.layer.path.data.push({ x: this.lastPoint.x, y: this.lastPoint.y });
        this.layer.render();
      }
    }
  };

  pointedUp = (e: PointerEvent): void => {
    this.isPressed = false;

    const p = { x: e.offsetX, y: e.offsetY };
    const iniPt = this.layer.path.data[0];
    if (this.layer.path.data.length > 1 && distSq(iniPt, p) < actRadiusSq) {
      this.layer.path.data.pop();
      this.layer.path.isClosed = true;
      this.layer.render();
      this.deactivate();
    }
  };

  // pointedDown = (e: PointerEvent) => {
  //   if (e.isPrimary) {
  //     const d = distSq(this.lastPoint, { x: e.offsetX, y: e.offsetY });
  //     if (d > actRadiusSq) {
  //       this.layer.path.data = [];
  //       this.layer.path.isClosed = false;
  //       this.layer.clear();
  //     }
  //     this.isDrawing = true;
  //   }
  // };

  // dragged = (e: PointerEvent): void => {
  //   if (this.isDrawing && e.isPrimary) {
  //     const d = distSq(this.lastPoint, { x: e.offsetX, y: e.offsetY });
  //     if (d > stickLengthSq) {
  //       this.lastPoint.x = e.offsetX;
  //       this.lastPoint.y = e.offsetY;
  //       this.layer.path.data.push({ x: this.lastPoint.x, y: this.lastPoint.y });
  //       this.layer.render();
  //     }
  //   }
  // };

  // pointedUp = () => {
  //   this.isDrawing = false;

  //   if (this.layer.path.data.length) {
  //     const iniPt = this.layer.path.data[0];
  //     const endPt = this.layer.path.data[this.layer.path.data.length - 1];
  //     if (distSq(iniPt, endPt) < actRadiusSq) {
  //       this.layer.path.isClosed = true;
  //       this.layer.render();
  //       this.deactivate();
  //     }
  //   }
  // };

  activate(): void {
    console.log('modeDraw activated');
    console.log('lastpoint', this.lastPoint);
    this.layer.emptyData();
    this.layer.clear();
    this.layer.path.isClosed = false;

    this.layer.parentStack.modeStandby.deactivate();
    this.layer.activate();
    this.layer.cnv.addEventListener('pointermove', this.dragged);
    this.layer.cnv.addEventListener('pointerdown', this.pointedDown);
    this.layer.cnv.addEventListener('pointerup', this.pointedUp);
    this.layer.cnv.addEventListener('pointerout', this.pointedUp);
  }

  deactivate(): void {
    console.log('modeDraw deactivated');
    this.lastPoint = { x: 0, y: 0 };
    this.layer.deactivate();
    this.layer.cnv.removeEventListener('pointermove', this.dragged);
    this.layer.cnv.removeEventListener('pointerdown', this.pointedDown);
    this.layer.cnv.removeEventListener('pointerup', this.pointedUp);
    this.layer.cnv.removeEventListener('pointerout', this.pointedUp);
    this.layer.parentStack.modeStandby.activate();
  }
}

export { ModeDraw };
