import ready from 'document-ready';
import * as d3 from 'd3-selection';
import { Point } from './barycenter';
// import { Point, barycenterBySurface } from './barycenter';
// import { ModeConfig } from './uiFunctions';
// import ModeDraw from './modeDraw';
import { Mode, Layer, layerOptions } from './layer';

declare global {
  interface Window {
    path: Point[];
    barySur: (ctx: CanvasRenderingContext2D) => Point;
  }
}
// window.d3 = d3;

// class layerSetup {

// }

interface layerSetup {
  name: string;
  layer?: Layer;
  layerOptions: layerOptions;
  loadOptions: string[];
}

function main() {
  const canvasStack = document.getElementById('canvasStack') as HTMLDivElement;

  const layers: layerSetup[] = [
    {
      name: 'layer1',
      layerOptions: {
        colorOpen: 'pink',
        colorClosed: 'red',
        colorBary: 'white',
      },
      loadOptions: ['triangle', 'square', 'dolphin'],
    },
    {
      name: 'layer2',
      layerOptions: {
        colorOpen: 'aquamarine',
        colorClosed: 'green',
        colorBary: 'white',
      },
      loadOptions: ['triangle', 'square', 'dolphin'],
    },
  ];

  layers.forEach((d) => {
    d.layer = new Layer(canvasStack, d.layerOptions);
  });

  const layerOver = new Layer(canvasStack, {
    colorOpen: 'aquamarine',
    colorClosed: 'green',
    colorBary: 'yellow',
  });

  canvasStack.addEventListener('triggerBarycenter', () => {
    drawGlobalBarycenter();
  });

  const globalBarycenter = (): Point => {
    const layer1 = layers[0].layer as Layer;
    const layer2 = layers[1].layer as Layer;
    const area1 = layer1.area;
    const area2 = layer2.area;
    const totalArea = area1 + area2;

    const X =
      (layer1.barycenter.x * area1) / totalArea +
      (layer2.barycenter.x * area2) / totalArea;
    const Y =
      (layer1.barycenter.y * area1) / totalArea +
      (layer2.barycenter.y * area2) / totalArea;
    return { x: X, y: Y };
  };

  const drawGlobalBarycenter = () => {
    const layer1 = layers[0].layer as Layer;
    const layer2 = layers[1].layer as Layer;
    if (layer1.path.data.length > 1 && layer2.path.data.length > 1) {
      layerOver.clear();
      const C = globalBarycenter();
      layerOver.barycenter = C;
      layerOver.drawBarycenter();
    }
  };

  // window.GlBary = drawGlobalBarycenter;

  layers[0].layer?.modeDraw.activate();

  let currentMode = layers[0].layer?.modeDraw as Mode;

  /* Create UI buttons */

  const layersUI = d3
    .select('#toolbar')
    .selectAll('div')
    .data(layers)
    .enter()
    .append('div')
    .classed('layerButtons', true);

  layersUI
    .append('button')
    .html((d) => `Draw ${d.name}`)
    .on('click', (ev, d) => {
      currentMode.deactivate();
      currentMode = d.layer?.modeDraw as Mode;
      currentMode.activate();
    });

  layersUI
    .append('button')
    .html((d) => `Edit ${d.name}`)
    .on('click', (ev, d) => {
      currentMode.deactivate();
      currentMode = d.layer?.modeEdit as Mode;
      currentMode.activate();
    });

  const makeLoadOptions = (layerStp: layerSetup) => {
    const container = document.createElement('span');
    const button = d3
      .select(container)
      .append('button')
      .html(`Load ${layerStp.name}`);

    const options = d3
      .select(container)
      .append('ul')
      .classed('hidden', true)
      .classed('loadOptionsList', true);

    options
      .selectAll('li')
      .data(layerStp.loadOptions)
      .enter()
      .append('li')
      .classed('loadOptionsItem', true)
      .html((d) => d)
      .on('click', (ev, d) => {
        const layer = layerStp.layer as Layer;
        console.log(d);
        layer.modeLoad.loadShape(d);
      });

    button.on('click', () => {
      options.classed('hidden', !options.classed('hidden'));
    });
    console.log(d3.select(container));

    return container;
  };

  console.log(makeLoadOptions(layers[0]));
  layersUI.append((d) => makeLoadOptions(d));
}

ready(main);
