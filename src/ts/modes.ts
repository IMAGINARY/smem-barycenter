/** Interface declarations for the layer classes */
// import d3 from 'd3-selection';
import { barycenterBySurface } from './barycenter';
import { distSq } from './mathHelpers';

interface Point {
  x: number;
  y: number;
}

interface Path {
  data: Point[];
  isClosed: boolean;
}

interface Parameters {
  colorClosed: string;
  colorOpen: string;
}

// A "Layer" is a canvas element that contains data (path, barycenter, parameters)...
interface Layer {
  cnv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  path: Path;
  parameters: Parameters; // Global state parameters
  barycenter: Point;
  area: number;
  activate(): void; // Prepares the user interaction (sets the event handlers, etc).
  render(): void; // Updates the image, can be called without previous activate().
  clear(): void;
  deactivate(): void; // Cleans all the user interaction.
}

class Layer implements Layer {
  constructor(parent: HTMLDivElement, parameters: Parameters) {
    this.cnv = document.createElement('canvas');
    this.cnv.width = parent.clientWidth;
    this.cnv.height = parent.clientHeight;
    const numLayer = parent.childElementCount;

    parent.appendChild(this.cnv);
    this.cnv.classList.add('layer');
    this.cnv.style.zIndex = numLayer.toString();

    this.ctx = this.cnv.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    this.parameters = parameters;

    this.cnv.style.pointerEvents = 'none';
    console.log(this.parameters);
    this.ctx.fillStyle = this.parameters.colorOpen;
    // this.ctx.fillStyle = numLayer === 0 ? 'blue' : 'red';

    this.path = { data: [], isClosed: false };
  }

  drawPath(): void {
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
    this.ctx.beginPath();
    this.ctx.moveTo(this.path.data[0].x, this.path.data[0].y);
    for (let i = 1; i < this.path.data.length; i++) {
      this.ctx.lineTo(this.path.data[i].x, this.path.data[i].y);
    }
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = this.path.isClosed
      ? this.parameters.colorClosed
      : this.parameters.colorOpen;
    this.ctx.fill('evenodd');
    if (this.path.isClosed) this.ctx.closePath();
    this.ctx.stroke();
  }

  drawBarycenter(): void {
    this.ctx.beginPath();
    this.ctx.arc(
      this.barycenter.x,
      this.barycenter.y,
      5,
      0,
      2 * Math.PI,
      false,
    );
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.stroke();
  }

  render(): void {
    this.drawPath();
    const bary = barycenterBySurface(this.ctx);
    this.barycenter = bary.center;
    this.area = bary.area;
    this.drawBarycenter();
  }

  clear(): void {
    this.path.data = [];
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.width);
  }

  activate(): void {
    this.cnv.style.pointerEvents = 'auto';
    console.log('layer activated');
  }
  deactivate(): void {
    this.cnv.style.pointerEvents = 'none';
  }
}

// Hardcoded parameters
const stickLengthSq = 0.5;
const actRadiusSq = 60 * 60; // activation radius squared

// A Mode extends a Layer with a functionality (user interaction)
interface Mode {
  layer: Layer;
  activate(): void; // Prepares the user interaction (sets the event handlers, etc.
  deactivate(): void; // Cleans all the user interaction and rendered features.
}

class ModeDraw implements Mode {
  layer: Layer;
  isDrawing: boolean;
  lastPoint: Point;

  constructor(layer: Layer) {
    this.layer = layer;
    this.isDrawing = false;
    this.lastPoint = { x: 0, y: 0 };
  }

  dragged = (e: PointerEvent): void => {
    if (this.isDrawing && e.isPrimary) {
      const d = distSq(this.lastPoint, { x: e.offsetX, y: e.offsetY });
      if (d > stickLengthSq) {
        this.lastPoint.x = e.offsetX;
        this.lastPoint.y = e.offsetY;
        this.layer.path.data.push({ x: this.lastPoint.x, y: this.lastPoint.y });
        this.layer.render();
      }
    }
  };

  pointedDown = (e: PointerEvent) => {
    if (e.isPrimary) {
      const d = distSq(this.lastPoint, { x: e.offsetX, y: e.offsetY });
      if (d > actRadiusSq) {
        this.layer.path.data = [];
        this.layer.path.isClosed = false;
        this.layer.clear();
      }
      this.isDrawing = true;
    }
  };

  pointedUp = () => {
    this.isDrawing = false;

    const iniPt = this.layer.path.data[0];
    const endPt = this.layer.path.data[this.layer.path.data.length - 1];
    if (distSq(iniPt, endPt) < actRadiusSq) {
      this.layer.path.isClosed = true;
      this.layer.render();
      this.deactivate();
    }
  };
  activate(): void {
    console.log('modeDraw activated');
    this.layer.activate();
    this.layer.cnv.addEventListener('pointermove', this.dragged);
    this.layer.cnv.addEventListener('pointerdown', this.pointedDown);
    this.layer.cnv.addEventListener('pointerup', this.pointedUp);
    this.layer.cnv.addEventListener('pointerout', this.pointedUp);
  }

  deactivate(): void {
    this.layer.deactivate();
    this.layer.cnv.removeEventListener('pointermove', this.dragged);
    this.layer.cnv.removeEventListener('pointerdown', this.pointedDown);
    this.layer.cnv.removeEventListener('pointerup', this.pointedUp);
    this.layer.cnv.removeEventListener('pointerout', this.pointedUp);
  }
}

export { Parameters, Layer, ModeDraw };
