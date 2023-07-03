import ready from 'document-ready';
import * as d3 from 'd3-selection';
import { Point } from './barycenter';
// import { Point, barycenterBySurface } from './barycenter';
// import { ModeConfig } from './uiFunctions';
// import ModeDraw from './modeDraw';
import { Mode, Layer, layerSetup } from './layer';
import { Stack } from './stack';

declare global {
  interface Window {
    path: Point[];
    barySur: (ctx: CanvasRenderingContext2D) => Point;
  }
}

function main() {
  const layers: layerSetup[] = [
    {
      name: 'layer1',
      layerOptions: {
        colorOpen: 'pink',
        colorClosed: 'red',
        colorBary: 'white',
      },
      loadOptions: ['triangle', 'square', 'whale', 'emy', 'hedy'],
    },
    {
      name: 'layer2',
      layerOptions: {
        colorOpen: 'aquamarine',
        colorClosed: 'green',
        colorBary: 'white',
      },
      loadOptions: ['triangle', 'square', 'dolphin', 'gannet'],
    },
  ];
  const canvasStack = document.getElementById('canvasStack') as HTMLDivElement;

  const stack = new Stack(canvasStack, layers);

  // standbyActivate();

  // window.standby = standbyActivate;
  // const standbyDeactivate = () => {
  //   console.log('standby deactivated');
  // };

  /* Create UI buttons */

  const layersUI = d3
    .select('#toolbar')
    .selectAll('div')
    .data(layers)
    .enter()
    .append('div')
    .classed('layerButtons', true)
    .style('background-color', (d) => `${d.layerOptions.colorOpen}`);

  layersUI
    .append('span')
    // .html((d) => `Draw ${d.name}`)
    .on('click', (ev, d) => {
      stack.currentMode.deactivate();
      stack.currentMode = d.layer?.modeDraw as Mode;
      stack.currentMode.activate();
    })
    .append('img')
    .attr('src', new URL('../img/pencil-icon.jpeg', import.meta.url).href);

  // layersUI
  //   .append('button')
  //   .html((d) => `Edit ${d.name}`)
  //   .on('click', (ev, d) => {
  //     currentMode.deactivate();
  //     currentMode = d.layer?.modeEdit as Mode;
  //     currentMode.activate();
  //   });

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

    return container;
  };

  layersUI.append((d) => makeLoadOptions(d));
}

ready(main);
