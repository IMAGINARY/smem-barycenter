import ready from 'document-ready';
import { Point } from './barycenter';
// import { Point, barycenterBySurface } from './barycenter';
// import { ModeConfig } from './uiFunctions';
import ModeDraw from './modeDraw';
import ModeFly from './modeFly';

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
  // window.mode = mode;

  canvas.addEventListener(
    'fullscreenchange',
    function () {
      if (canvas !== document.fullscreenElement) {
        canvas.width = 800;
        canvas.height = 800;
      }
    },
    false,
  );

  document.getElementById('barycenterButton')?.addEventListener('click', () => {
    canvas.width = screen.width;
    canvas.height = screen.height;
    canvas
      .requestFullscreen()
      .then(() => screen.orientation.lock('landscape'))
      .then(
        (success) => {
          console.log(success);
          canvas.width = screen.width;
          canvas.height = screen.height;
        },
        (failure) => console.log(failure),
      )
      .catch((err: Error) => {
        alert(
          `An error occurred while trying to switch into fullscreen mode: ${err.message} (${err.name})`,
        );
      });
  });
  // window.path = path;
  // window.barySur = barycenterBySurface;

  const canvasFly = document.getElementById('canvasFly') as HTMLCanvasElement;
  const ctxFly = canvasFly.getContext('2d') as CanvasRenderingContext2D;
  const modeFly = new ModeFly(ctxFly, path);
  modeFly.activate();
}

ready(main);
