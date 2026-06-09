// Hand-authored minimal Lottie: a rotating dashed neon ring with a counter-rotating inner dot.
// Self-contained so the build never depends on an external Lottie host.
const ringData = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 180,
  w: 200,
  h: 200,
  nm: "neon-ring",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "outer-ring",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 180, s: [360] },
          ],
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [150, 150] } },
            {
              ty: "st",
              c: { a: 0, k: [0.247, 0.247, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 5 },
              lc: 2,
              lj: 1,
              d: [
                { n: "d", v: { a: 0, k: 20 } },
                { n: "g", v: { a: 0, k: 28 } },
              ],
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "inner-ring",
      sr: 1,
      ks: {
        o: { a: 0, k: 80 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [360] },
            { t: 180, s: [0] },
          ],
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [96, 96] } },
            {
              ty: "st",
              c: { a: 0, k: [0.851, 1, 0.239, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 1,
              d: [
                { n: "d", v: { a: 0, k: 6 } },
                { n: "g", v: { a: 0, k: 22 } },
              ],
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "core-dot",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [40] },
            { t: 90, s: [100] },
            { t: 180, s: [40] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [80, 80, 100] },
            { t: 90, s: [120, 120, 100] },
            { t: 180, s: [80, 80, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [26, 26] } },
            {
              ty: "fl",
              c: { a: 0, k: [0.851, 0.376, 0.937, 1] },
              o: { a: 0, k: 100 },
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0,
    },
  ],
};

export default ringData;
