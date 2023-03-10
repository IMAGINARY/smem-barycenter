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

function barycenterBySurface(ctx: CanvasRenderingContext2D): Point {
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

  return { x: Cx, y: Cy };
}

export { Point, barycenterBySurface, barycenterByBorder };
