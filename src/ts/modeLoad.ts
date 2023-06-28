import { Layer, Mode } from './layer';
import * as samples from './samples';

// Hardcoded parameters

// const stickLengthSq = 0.5;
// const actRadiusSq = 60 * 60; // activation radius squared
// const nodeRadius = 5;

interface ModeLoad extends Mode {
  loadShape(name: string): void;
}

class ModeLoad implements ModeLoad {
  layer: Layer;

  constructor(layer: Layer) {
    this.layer = layer;
  }

  loadShape(name: string): void {
    const shape = samples[name as keyof typeof samples] as samples.Sample;

    const width = this.layer.cnv.width;
    const height = this.layer.cnv.height;
    const scale = width / shape.size / 2;

    this.layer.path.data = shape.data.map((d) => ({
      x: d.x * scale + width / 2,
      y: -d.y * scale + height / 2,
    }));
    this.layer.path.isClosed = true;

    this.layer.render();
  }

  activate(): void {
    console.log('modeLoad activated');
    // this.layer.activate();
    // this.loadShape('fish');
  }

  deactivate(): void {
    this.layer.clear();
    this.layer.render();
    this.layer.deactivate();
  }
}

export { ModeLoad };
