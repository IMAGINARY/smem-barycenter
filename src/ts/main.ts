interface Point {
  x: number;
  y: number;
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', {
  willReadFrequently: true,
}) as CanvasRenderingContext2D;
const w = canvas.width;
const h = canvas.height;

console.log('width: ', w);
console.log('height: ', h);

let path = [] as Point[];
const lastPoint = { x: 0, y: 0 };
const stickLength = 1;
let drawing = false;

canvas.addEventListener('pointermove', dragged);
canvas.addEventListener('pointerdown', pointedDown);
canvas.addEventListener('pointerup', pointedUp);
canvas.addEventListener('pointerout', pointedUp);

function dragged(e: PointerEvent): void {
  if (drawing) {
    const d =
      (lastPoint.x - e.offsetX) * (lastPoint.x - e.offsetX) +
      (lastPoint.y - e.offsetY) * (lastPoint.y - e.offsetY);
    if (d > stickLength * stickLength) {
      lastPoint.x = e.offsetX;
      lastPoint.y = e.offsetY;
      path.push({ x: lastPoint.x, y: lastPoint.y });
      draw();
    }
  }
}

function pointedDown() {
  path = [];
  drawing = true;
}

function pointedUp() {
  drawing = false;
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'grey';
  ctx.fill();
  ctx.closePath();

  const B = barycenter(path);

  ctx.beginPath();
  ctx.arc(B.x, B.y, 5, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.stroke();
}

function barycenter(P: Point[]): Point {
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

  console.log(`barycenter: (${Cx},${Cy})`);
  return { x: Cx, y: Cy };
}

function barycenterBySurface(): Point {
  //context: CanvasRenderingContext2D
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
  console.log(`barycenterSurf: (${Cx},${Cy})`);

  return { x: Cx, y: Cy };
}

export {};

declare global {
  interface Window {
    path: Point[];
    barySur: () => Point;
  }
}

window.path = path;
window.barySur = barycenterBySurface;
