import ready from 'document-ready';
import * as d3 from 'd3-selection';
import { Point } from './barycenter';
// import { Point, barycenterBySurface } from './barycenter';
// import { ModeConfig } from './uiFunctions';
// import ModeDraw from './modeDraw';
import { Mode, Layer } from './layer';
import { ModeDraw } from './modeDraw';
import { ModeEdit } from './modeEdit';

declare global {
  interface Window {
    path: Point[];
    barySur: (ctx: CanvasRenderingContext2D) => Point;
  }
}
// window.d3 = d3;

function main() {
  const canvasStack = document.getElementById('canvasStack') as HTMLDivElement;

  const layer1 = new Layer(canvasStack, {
    colorOpen: 'pink',
    colorClosed: 'red',
  });
  const modeDraw1 = new ModeDraw(layer1);

  const modeEdit1 = new ModeEdit(layer1);

  const layer2 = new Layer(canvasStack, {
    colorOpen: 'aquamarine',
    colorClosed: 'green',
  });
  const modeDraw2 = new ModeDraw(layer2);

  const layerOver = new Layer(canvasStack, {
    colorOpen: 'aquamarine',
    colorClosed: 'green',
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
    layerOver.clear();
    const C = globalBarycenter();
    layerOver.barycenter = C;
    layerOver.drawBarycenter();
  };

  // window.GlBary = drawGlobalBarycenter;

  modeDraw1.activate();

  let currentMode = modeDraw1 as Mode;

  d3.select('#appContainer')
    .append('button')
    .html('layer1')
    .on('click', () => {
      currentMode.deactivate();
      currentMode = modeDraw1;
      currentMode.activate();
    });

  d3.select('#appContainer')
    .append('button')
    .html('layer2')
    .on('click', () => {
      currentMode.deactivate();
      currentMode = modeDraw2;
      currentMode.activate();
    });

  d3.select('#appContainer')
    .append('button')
    .html('Global Barycenter')
    .on('click', drawGlobalBarycenter);

  d3.select('#appContainer')
    .append('button')
    .html('Edit1')
    .on('click', () => {
      currentMode.deactivate();
      currentMode = modeEdit1;
      currentMode.activate();
    });
}

ready(main);
