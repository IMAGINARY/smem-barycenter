import ready from 'document-ready';
import * as d3 from 'd3-selection';
import { Point } from './barycenter';
import { Layer, layerSetup } from './layer';
import { Stack } from './stack';
import * as shp from '../img/shp-assets';
import { printCanvases } from './export';

declare global {
  interface Window {
    path: Point[];
    barySur: (ctx: CanvasRenderingContext2D) => Point;
  }
}

function main() {
  const layers: layerSetup[] = [
    {
      layerOptions: {
        name: 'layer1',
        colorOpen: 'pink',
        colorClosed: 'red',
        colorBary: 'white',
      },
      loadOptions: ['triangle', 'square', 'whale', 'emy', 'hedy'],
    },
    {
      layerOptions: {
        name: 'layer2',
        colorOpen: 'aquamarine',
        colorClosed: 'green',
        colorBary: 'white',
      },
      loadOptions: ['triangle', 'square', 'dolphin', 'gannet'],
    },
    {
      layerOptions: {
        name: 'layer3',
        colorOpen: 'turquoise',
        colorClosed: 'blue',
        colorBary: 'white',
      },
      loadOptions: ['triangle', 'square', 'dolphin', 'gannet'],
    },
  ];

  const loadOptions = [
    'triangle',
    'square',
    'whale',
    'emy',
    'hedy',
    'dolphin',
    'gannet',
  ];

  const canvasStack = document.getElementById('canvasStack') as HTMLDivElement;

  const stack = new Stack(canvasStack, layers);

  // standbyActivate();

  // window.standby = standbyActivate;
  // const standbyDeactivate = () => {
  //   console.log('standby deactivated');
  // };

  /* Create UI buttons */

  // const layersUI = d3
  //   .select('#toolbar')
  //   .append('div')
  //   .attr('id', 'layersToolbar')
  //   .selectAll('div')
  //   .enter()
  //   .append('div');

  d3.select('#toolbar')
    .selectAll('span.layerButtons')
    .data(layers)
    .enter()
    .append('span')
    .classed('layerButtons', true)
    .style('background-color', (d) => `${d.layerOptions.colorClosed}`)
    .classed('button', true)
    .attr('id', (d) => `button-${d.layerOptions.name}`)
    .on('click', (ev, d) => {
      stack.switchLayer(d.layer as Layer);
    });
  // .append('img')
  // .attr('src', new URL('../img/pencil-icon.jpeg', import.meta.url).href);

  stack.switchLayer(stack.currentLayer);

  d3.select('#toolbar2')
    .append('span')
    .classed('button', true)
    // .html((d) => `Draw ${d.name}`)
    .on('click', () => {
      stack.switchMode(stack.currentLayer.modeDraw);
    })
    .append('img')
    .attr('src', new URL('../img/pencil-icon.jpeg', import.meta.url).href);

  d3.select('#toolbar2')
    .selectAll('span.loadOptionsItem')
    .data(loadOptions)
    .enter()
    .append('span')
    .classed('loadOptionsItem', true)
    .classed('button', true)
    // .html((d) => d)
    .on('click', (ev, d) => {
      const layer = stack.currentLayer;
      console.log(d);
      layer.modeLoad.loadShape(d);
    })
    .append('img')
    .attr('src', (d) => shp[`shp_${d}` as keyof typeof shp]);

  d3.select('#toolbar2')
    .append('span')
    .classed('trashButton', true)
    .classed('button', true)
    .on('click', () => {
      stack.currentLayer.emptyData();
      stack.currentLayer.clear();
      stack.currentLayer.computeBarycenter();
      stack.currentMode.deactivate();
    })
    .on('dblclick', () => {
      stack.layers.forEach((layer) => {
        layer.emptyData();
        layer.clear();
        layer.computeBarycenter();
      });
      stack.currentMode.deactivate();
    })
    .append('img')
    .attr('src', new URL('../img/trash-icon.jpeg', import.meta.url).href);

  // Print button
  d3.select('#toolbar')
    .append('span')
    // .classed('layerButtons', true)
    .classed('printerButton', true)
    .classed('button', true)
    .append('img')
    .attr('src', new URL('../img/printer-icon.jpeg', import.meta.url).href)
    .on('click', () => printCanvases(stack));
}

ready(main);
