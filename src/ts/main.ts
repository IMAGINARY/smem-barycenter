import ready from 'document-ready';
import { Point } from './barycenter';
// import { Point, barycenterBySurface } from './barycenter';
// import { ModeConfig } from './uiFunctions';
import ModeDraw from './modeDraw';

declare global {
  interface Window {
    path: Point[];
    barySur: (ctx: CanvasRenderingContext2D) => Point;
  }
}

function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d', {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;

  console.log('width: ', canvas.width);
  console.log('height: ', canvas.height);

  const path = [] as Point[];

  const mode = new ModeDraw(ctx, path);
  mode.activate();

  // window.path = path;
  // window.barySur = barycenterBySurface;
}

// document.documentElement.requestFullscreen().catch((err: Error) => {
//   alert(
//     `An error occurred while trying to switch into fullscreen mode: ${err.message} (${err.name})`,
//   );
// });

ready(main);
