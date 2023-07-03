import { Layer, layerSetup } from './layer';

interface Point {
  x: number;
  y: number;
}

function barycenterByBorder(P: Point[]): Point {
  const N = P.length;
  let SX = 0;
  let SY = 0;
  let SA = 0;
  for (let i = 0; i < N; i++) {
    SX +=
      (P[i].x + P[(i + 1) % N].x) *
      (P[i].x * P[(i + 1) % N].y - P[(i + 1) % N].x * P[i].y);
    SY +=
      (P[i].y + P[(i + 1) % N].y) *
      (P[i].x * P[(i + 1) % N].y - P[(i + 1) % N].x * P[i].y);
    SA += P[i].x * P[(i + 1) % N].y - P[(i + 1) % N].x * P[i].y;
  }
  const A = (1 / 2) * SA;
  const Cx = (1 / (6 * A)) * SX;
  const Cy = (1 / (6 * A)) * SY;

  //   console.log(`barycenter: (${Cx},${Cy})`);
  //   console.log(`area: ${A}`);
  return { x: Cx, y: Cy };
}

function barycenterBySurface(ctx: CanvasRenderingContext2D): {
  center: Point;
  area: number;
} {
  //context: CanvasRenderingContext2D
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const imgArray = ctx.getImageData(0, 0, w, h).data;

  let SX = 0;
  let SY = 0;
  let N = 0;
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      if (imgArray[4 * (i + w * j) + 3] !== 0) {
        SX += i;
        SY += j;
        N += 1;
      }
    }
  }
  const Cx = SX / N;
  const Cy = SY / N;
  //   console.log(`barycenterSurf: (${Cx},${Cy})`);
  // console.log(`area: ${N}`);
  return { center: { x: Cx, y: Cy }, area: N };
}

const globalBarycenter = (layers: layerSetup[]): Point => {
  const totalArea = layers
    .map((d) => d.layer?.area as number)
    .reduce((acc, curr) => acc + curr, 0);

  const X =
    layers
      .map((d) => (d.layer?.barycenter.x as number) * (d.layer?.area as number))
      .reduce((acc, curr) => acc + curr, 0) / totalArea;

  const Y =
    layers
      .map((d) => (d.layer?.barycenter.y as number) * (d.layer?.area as number))
      .reduce((acc, curr) => acc + curr, 0) / totalArea;

  return { x: X, y: Y };
};

const drawGlobalBarycenter = (layers: layerSetup[], targetLayer: Layer) => {
  if (
    layers
      .map((d) => (d.layer?.path.data.length as number) > 1)
      .reduce((acc, curr) => acc && curr, true)
  ) {
    targetLayer.clear();
    const C = globalBarycenter(layers);
    targetLayer.barycenter = C;
    targetLayer.drawBarycenter();
  }
};

export {
  Point,
  barycenterBySurface,
  barycenterByBorder,
  globalBarycenter,
  drawGlobalBarycenter,
};
