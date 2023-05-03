/** Interface declarations for the layer classes */
import d3 from 'd3-selection';

interface Point {
  x: number;
  y: number;
}

interface Parameters {
  idNodeCount: number;
  idEdgeCount: number;
  outputContainer: HTMLElement;
  nodeIndex: string[]; // array of the ids of the nodes. The cy.nodes() array should not be mutated.
  isoTargetParams?: Parameters;
}

// A "Layer" is a canvas element that allows interaction (drawing path, computing barycenter...)
interface Layer {
  cnv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  path: Point[];
  parameters: Parameters; // Global state parameters
  barycenter: Point;
  area: number;
  activate(): void; // Prepares the user interaction (sets the event handlers, etc).
  render(): void; // Updates the image, can be called without previous activate().
  deactivate(): void; // Cleans all the user interaction.
}

class Layer implements Layer {
  constructor(parent: HTMLDivElement) {
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

    this.cnv.style.pointerEvents = 'none';
    this.ctx.fillStyle = numLayer === 0 ? 'blue' : 'red';
  }

  render(): void {
    this.ctx.arc(
      this.cnv.width * Math.random(),
      this.cnv.height * Math.random(),
      20,
      0,
      2 * Math.PI,
    );
    this.ctx.fill();
  }

  activate(): void {
    this.cnv.style.pointerEvents = 'auto';

    const handleTap = (event: PointerEvent) => {
      console.log(event);
      this.ctx.beginPath();
      //   this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
      this.ctx.arc(event.offsetX, event.offsetY, 20, 0, 2 * Math.PI);
      this.ctx.fill();
    };
    this.cnv.addEventListener('pointerdown', handleTap);
  }
  deactivate(): void {
    this.cnv.style.pointerEvents = 'none';
  }
}

export { Parameters, Layer };
