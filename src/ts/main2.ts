import ready from 'document-ready';
import * as d3 from 'd3-selection';
import { Point } from './barycenter';
// import { Point, barycenterBySurface } from './barycenter';
// import { ModeConfig } from './uiFunctions';
// import ModeDraw from './modeDraw';
import { Mode, Layer } from './layer';
import { ModeDraw } from './modeDraw';
import { ModeEdit } from './modeEdit';
import { ModeLoad } from './modeLoad';

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
  layer: Layer;
  modeDraw: ModeDraw;
  modeEdit: ModeEdit;
  modeLoad: ModeLoad;
  loadOptions: string[];
}

function main() {
  const canvasStack = document.getElementById('canvasStack') as HTMLDivElement;

  const layer1 = new Layer(canvasStack, {
    colorOpen: 'pink',
    colorClosed: 'red',
    colorBary: 'white',
  });
  const modeDraw1 = new ModeDraw(layer1);
  const modeEdit1 = new ModeEdit(layer1);
  const modeLoad1 = new ModeLoad(layer1);

  const layer2 = new Layer(canvasStack, {
    colorOpen: 'aquamarine',
    colorClosed: 'green',
    colorBary: 'white',
  });
  const modeDraw2 = new ModeDraw(layer2);
  const modeEdit2 = new ModeEdit(layer2);
  const modeLoad2 = new ModeLoad(layer2);

  const layers = [
    {
      name: 'layer1',
      layer: layer1,
      modeDraw: modeDraw1,
      modeEdit: modeEdit1,
      modeLoad: modeLoad1,
      loadOptions: ['triangle', 'square', 'fish'],
    },
    {
      name: 'layer2',
      layer: layer2,
      modeDraw: modeDraw2,
      modeEdit: modeEdit2,
      modeLoad: modeLoad2,
      loadOptions: ['triangle', 'square', 'fish'],
    },
  ];

  const layerOver = new Layer(canvasStack, {
    colorOpen: 'aquamarine',
    colorClosed: 'green',
    colorBary: 'yellow',
  });

  canvasStack.addEventListener('triggerBarycenter', () => {
    drawGlobalBarycenter();
  });

  const globalBarycenter = (): Point => {
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
    if (layer1.path.data.length > 1 && layer2.path.data.length > 1) {
      layerOver.clear();
      const C = globalBarycenter();
      layerOver.barycenter = C;
      layerOver.drawBarycenter();
    }
  };

  // window.GlBary = drawGlobalBarycenter;

  modeDraw1.activate();

  let currentMode = modeDraw1 as Mode;

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
      currentMode = d.modeDraw;
      currentMode.activate();
    });

  layersUI
    .append('button')
    .html((d) => `Edit ${d.name}`)
    .on('click', (ev, d) => {
      currentMode.deactivate();
      currentMode = d.modeEdit;
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
        console.log(d);
        layerStp.modeLoad.loadShape(d);
      });

    button.on('click', () => {
      options.classed('hidden', !options.classed('hidden'));
    });
    console.log(d3.select(container));

    return container;
  };

  console.log(makeLoadOptions(layers[0]));
  layersUI.append((d) => makeLoadOptions(d));

  // layersUI
  //   .append('select')
  //   .selectAll('option')
  //   .data((d) => d.layer.parameters.loadOptions)
  //   .enter()
  //   .append('option')
  //   .html((d) => `Load ${d}`)
  //   .on('change', (ev, d, i, n) => {
  //     const mode = console.log(d3.select(n[i].parentNode).datum().modeLoad);
  //     console.log(mode);
  //     currentMode.deactivate();
  //     currentMode = mode;
  //     currentMode.activate();
  //     mode.loadShape(d);
  //   });

  // d3.select('#toolbar')
  //   .append('button')
  //   .html('Global Barycenter')
  //   .on('click', drawGlobalBarycenter);

  //   d3.select('#toolbar')
  //     .append('button')
  //     .html('Load')
  //     .on('click', () => {
  //       currentMode.deactivate();
  //       currentMode = modeLoad1;
  //       currentMode.activate();
  //     });
}

ready(main);
