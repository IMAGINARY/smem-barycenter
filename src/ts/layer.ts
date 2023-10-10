/** Interface declarations for the layer classes */
import { barycenterBySurface } from './barycenter';
import { ModeDraw } from './modeDraw';
import { ModeEdit } from './modeEdit';
import { ModeLoad } from './modeLoad';
import { Stack } from './stack';

interface Point {
  x: number;
  y: number;
}

interface Path {
  data: Point[];
  isClosed: boolean;
}

interface layerOptions {
  name: string;
  colorClosed: string;
  colorOpen: string;
  colorBary: string;
}

interface layerSetup {
  // name: string;
  layer?: Layer;
  layerOptions: layerOptions;
  loadOptions: string[];
}

// A "Layer" is a canvas element that contains data (path, barycenter, parameters)...
interface Layer {
  name: string;
  parentStack: Stack;
  cnv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  path: Path;
  parameters: layerOptions; // Global state parameters
  barycenter: Point;
  area: number;
  activate(): void; // Prepares the user interaction (sets the event handlers, etc).
  render(): void; // Updates the image, can be called without previous activate().
  clear(): void;
  deactivate(): void; // Cleans all the user interaction.
  active: boolean;
  modeDraw: Mode;
  modeEdit: Mode;
  modeLoad: ModeLoad;
}

// A "Mode" extends a Layer with a functionality (user interaction)
interface Mode {
  layer: Layer;
  activate(): void; // Prepares the user interaction (sets the event handlers, etc.
  deactivate(): void; // Cleans all the user interaction and rendered features.
}

const triggerBarycenter = new Event('triggerBarycenter', { bubbles: true });

class Layer implements Layer {
  constructor(
    parentStack: Stack,
    parentElement: HTMLDivElement,
    parameters: layerOptions,
  ) {
    this.name = parameters.name;
    this.parentStack = parentStack;
    this.cnv = document.createElement('canvas');
    this.cnv.width = parentElement.clientWidth;
    this.cnv.height = parentElement.clientHeight;
    const numLayer = parentElement.childElementCount;

    parentElement.appendChild(this.cnv);
    this.cnv.classList.add('layer');
    this.cnv.style.zIndex = numLayer.toString();

    this.ctx = this.cnv.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    this.parameters = parameters;

    this.cnv.style.pointerEvents = 'none';
    // console.log(this.parameters);
    this.ctx.fillStyle = this.parameters.colorOpen;
    // this.ctx.fillStyle = numLayer === 0 ? 'blue' : 'red';

    this.path = { data: [], isClosed: false };

    this.modeDraw = new ModeDraw(this);
    this.modeEdit = new ModeEdit(this);
    this.modeLoad = new ModeLoad(this);

    this.active = false;
  }

  drawPath(): void {
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
    this.ctx.fillStyle = this.parameters.colorBary;
    this.ctx.fill();
    this.ctx.stroke();
  }

  computeBarycenter(): void {
    const bary = barycenterBySurface(this.ctx);
    this.barycenter = bary.center;
    this.area = bary.area;
    this.cnv.dispatchEvent(triggerBarycenter);
  }

  render(): void {
    if (this.path.data.length) {
      this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
      this.drawPath();
      this.computeBarycenter();
      this.drawBarycenter();
    }
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.width);
  }

  emptyData(): void {
    this.path.data = [];
  }

  activate(): void {
    this.cnv.style.pointerEvents = 'auto';
    console.log(`Layer "${this.name}" activated`);
    this.active = true;
  }
  deactivate(): void {
    this.cnv.style.pointerEvents = 'none';
    console.log(`Layer "${this.name}" deactivated`);
    this.active = false;
  }
}

export { Point, Path, layerOptions, Layer, Mode, layerSetup };
