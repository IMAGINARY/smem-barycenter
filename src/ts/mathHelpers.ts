interface Point {
  x: number;
  y: number;
}

const distSq = (ptA: Point, ptB: Point): number =>
  (ptA.x - ptB.x) * (ptA.x - ptB.x) + (ptA.y - ptB.y) * (ptA.y - ptB.y);

const dist = (ptA: Point, ptB: Point): number => Math.sqrt(distSq(ptA, ptB));

// Linear interpolation between x and y.
const lerp = (x: number, y: number, t: number) => (1 - t) * x + t * y;

const inverseLerp = (x: number, y: number, p: number) => {
  if (Math.abs(y - x) !== 0) {
    return Math.min(1, Math.max(0, Math.abs(p - x) / Math.abs(y - x)));
  } else return 0;
};

const slerp = (u: Point, v: Point, t: number) => {
  const angle = Math.acos(u.x * v.x + u.y * v.y);

  if (angle < 0.1) {
    return u;
  } else {
    return {
      x:
        (Math.sin((1 - t) * angle) * u.x + Math.sin(t * angle) * v.x) /
        Math.sin(angle),
      y:
        (Math.sin((1 - t) * angle) * u.y + Math.sin(t * angle) * v.y) /
        Math.sin(angle),
    };
  }
};

// Clamps x between the values a and b.
const clamp = (x: number, a: number, b: number) =>
  a <= b ? Math.min(Math.max(x, a), b) : Math.min(Math.max(x, b), a);

export { Point, lerp, inverseLerp, slerp, distSq, dist, clamp };
