import { drawGlobalBarycenter } from './barycenter';
import { Layer, layerSetup } from './layer';
import { Mode } from './layer';
import { ModeStandby } from './modeStandby';

// A "Stack" is a collection of layers, each one on top of the other.
interface Stack {
  parentElement: HTMLDivElement;
  layers: Layer[];
  layerOver: Layer;
  modeStandby: SMode;
  currentLayer: Layer;
  currentMode: Mode;
  switchLayer(layer: Layer): void;
  switchMode(mode: Mode): void;
}

// A "SMode" or Stack Mode, adds a functionality (user interaction) to a Stack
interface SMode {
  stack: Stack;
  activate(): void;
  deactivate(): void;
}

class Stack implements Stack {
  constructor(parent: HTMLDivElement, layers: layerSetup[]) {
    this.parentElement = parent;
    layers.forEach((d) => {
      d.layer = new Layer(this, parent, d.layerOptions);
    });

    this.layers = layers.map((d) => d.layer as Layer);

    this.currentLayer = layers[0].layer as Layer;
    this.currentMode = layers[0].layer?.modeDraw as Mode;
    // this.currentLayer.activate();
    // this.currentMode.activate();

    this.layerOver = new Layer(this, parent, {
      colorOpen: 'aquamarine',
      colorClosed: 'green',
      colorBary: 'yellow',
    });

    parent.addEventListener('triggerBarycenter', () => {
      drawGlobalBarycenter(layers, this.layerOver);
    });

    this.modeStandby = new ModeStandby(this);
    this.modeStandby.activate();
  }

  switchLayer(layer: Layer) {
    this.currentLayer.deactivate();
    this.currentLayer = layer;
    this.currentLayer.activate();
  }

  switchMode(mode: Mode) {
    this.currentMode.deactivate();
    if (this.currentLayer !== mode.layer) this.switchLayer(mode.layer);
    this.currentMode = mode;
    this.currentMode.activate();
  }
}

export { Stack, SMode };
