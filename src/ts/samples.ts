import { Point } from './layer';

interface Sample {
  name: string;
  data: Point[];
  size: number; // approximate (horizontal) size of the image
}

const square = {
  name: 'square',
  data: [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ],
  size: 2.8,
};

let triangle;
{
  const N = 3;
  const pts = [];
  for (let i = 0; i < N; i++) {
    pts.push({
      x: Math.cos(((2 * Math.PI) / N) * i),
      y: Math.sin(((2 * Math.PI) / N) * i),
    });
  }
  triangle = { name: 'triangle', data: pts, size: 2 };
}

let fish;
{
  const dattr =
    '2780,11400 2170,11300 1650,11200 1220,11000 881,10800 802,10800 719,10700 644,10600 587,10500 542,10500 504,10400 472,10300 448,10200 431,10100 424,10000 429,9870 444,9760 454,9720 458,9690 456,9680 448,9670 386,9630 295,9570 203,9500 135,9430 87.9,9370 46.2,9300 16.6,9230 6,9150 31.6,9020 107,8920 236,8850 420,8810 468,8810 545,8800 639,8790 740,8780 1120,8740 1410,8710 1630,8670 1820,8610 1950,8560 2090,8500 2190,8440 2230,8400 2230,8390 2220,8360 2210,8330 2190,8290 2110,8080 2060,7850 2030,7620 2030,7390 2090,7060 2210,6750 2400,6470 2650,6220 2770,6140 2910,6040 3030,5980 3090,5960 3090,5980 3100,6040 3100,6130 3100,6240 3110,6440 3120,6590 3140,6710 3170,6840 3220,7010 3290,7170 3380,7300 3480,7430 3500,7450 3520,7470 3540,7490 3560,7510 3610,7540 3660,7570 3720,7610 3770,7640 4200,7400 4710,7140 5260,6860 5840,6590 5990,6520 6150,6440 6360,6330 6680,6150 7130,5900 7420,5730 7650,5580 7920,5380 8230,5150 8530,4900 8810,4620 9070,4310 9310,3940 9560,3510 9790,3070 9980,2640 10000,2530 10100,2410 10100,2300 10100,2260 10100,2250 10100,2250 10000,2240 10000,2230 9510,2040 9030,1680 8630,1220 8360,697 8320,572 8300,450 8290,342 8300,258 8300,251 8300,244 8300,238 8310,231 8340,250 8370,269 8400,288 8430,307 8600,407 8750,482 8890,536 9010,572 9100,585 9210,587 9360,579 9560,559 9780,540 10000,535 10200,543 10500,565 10900,595 11300,586 11700,538 12000,454 12100,409 12200,349 12400,250 12600,91 12700,55.7 12700,26.8 12800,7.19 12800,0 12800,49.6 12800,169 12800,316 12800,446 12700,572 12700,673 12700,758 12700,837 12500,1110 12300,1390 12000,1660 11700,1890 11600,1920 11600,1960 11500,2010 11400,2050 11300,2140 11100,2200 11100,2250 11000,2300 11000,2350 10900,2400 10900,2460 10900,2520 10900,2560 10900,2610 10900,2670 10900,2740 10800,3540 10700,4320 10500,5070 10300,5790 10300,5850 10300,5900 10300,5940 10300,5970 10200,6070 10200,6240 10100,6420 10000,6590 9770,7210 9450,7790 9100,8320 8700,8830 8590,8960 8500,9080 8430,9180 8380,9290 8320,9410 8290,9530 8280,9630 8300,9730 8330,9800 8380,9860 8440,9920 8510,9960 8530,9970 8550,9990 8570,10000 8570,10000 8560,10000 8530,10100 8490,10200 8450,10200 8390,10300 8320,10300 8260,10400 8200,10400 8120,10500 8050,10500 7950,10500 7810,10500 7660,10500 7500,10500 7320,10500 7090,10400 7030,10400 6980,10400 6920,10400 6860,10400 6820,10400 6770,10400 6730,10500 6690,10500 6000,10800 5280,11100 4530,11200 3740,11300 3530,11300 3260,11400 2990,11400';

  const pts = dattr
    .split(' ')
    .map((d) => d.split(','))
    .map((d) => ({ x: d[0], y: d[1] }));

  fish = { name: 'fish', data: pts, size: 15000 };
}

export { Sample, square, triangle, fish };
