import { Point } from './barycenter';
import { Layer } from './layer';
import { SMode, Stack } from './stack';

class ModeStandby implements SMode {
  stack: Stack;
  // Pick which layer is pointed at, make it active.

  constructor(stack: Stack) {
    this.stack = stack;
  }

  selectLayers = (p: Point): Layer | undefined => {
    let selectedLayer: Layer | undefined;
    console.log('selecting a layer from ', p);
    this.stack.layers.forEach((d) => {
      const color = d.ctx.getImageData(p.x, p.y, 1, 1).data;
      if (color[3] !== 0) {
        selectedLayer = d;
      }
    });
    return selectedLayer;
  };

  pointedDown = (e: PointerEvent) => {
    if (e.isPrimary) {
      const basePoint = { x: e.offsetX, y: e.offsetY } as Point;
      const layer = this.selectLayers(basePoint);

      if (layer) {
        this.stack.switchMode(layer.modeEdit);
      } else {
        this.stack.currentMode.deactivate();
      }
    }
  };

  activate(): void {
    console.log('modeStandby activated');
    this.stack.parentElement.addEventListener('pointerdown', this.pointedDown);
  }

  deactivate(): void {
    console.log('modeStandby deactivated');
    this.stack.parentElement.removeEventListener(
      'pointerdown',
      this.pointedDown,
    );
  }
}

export { ModeStandby };
