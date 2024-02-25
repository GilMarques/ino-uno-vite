import * as THREE from "three";

function RoundedBoxFlat(w, h, d, r, s) {
  const pi2 = Math.PI * 2;
  const n = (s + 1) * 4; // number of segments

  let indices = [];
  let positions = [];
  let uvs = [];

  makeFronts(n, 1, 0); // segments, front is 1, start index 0 is center front
  makeFronts(n, -1, n + 1); // segments, back is -1, start index n + 1 is center back

  makeFrame(n, 2 * n + 2, 1, n + 2); // segments, start index framing ,start index front, start index back

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );
  geometry.setAttribute(
    "uv",
    new THREE.BufferAttribute(new Float32Array(uvs), 2)
  );

  // add multimaterial groups for front, back, framing

  const vtc = n * 3; // vertex count
  geometry.addGroup(0, vtc, 0);
  geometry.addGroup(vtc, vtc, 1);
  geometry.addGroup(2 * vtc, 2 * vtc + 3, 2);

  geometry.computeVertexNormals();

  return geometry;

  function makeFronts(n, side, idx) {
    const d0 = side === 1 ? 0 : 1;
    const d1 = side === 1 ? 1 : 0;

    for (let j = 1; j < n; j++) {
      indices.push(idx, idx + d0 + j, idx + d1 + j);
    }

    const d2 = side === 1 ? n : 1;
    const d3 = side === 1 ? 1 : n;

    indices.push(idx, idx + d2, idx + d3);

    positions.push(0, 0, (side * d) / 2); // center
    uvs.push(0.5, 0.5);

    for (let j = 0; j < n; j++) {
      // contour

      const qu = Math.trunc((4 * j) / n) + 1; // quadrant  qu: 1..4
      const sgn = qu === 1 || qu === 4 ? 1 : -1; // signum left/right

      const c = {
        x: sgn * (w / 2 - r),
        y: (qu < 3 ? 1 : -1) * (h / 2 - r),
        z: (side * d) / 2,
      }; // quadrant center

      const x = c.x + r * Math.cos((pi2 * (j - qu + 1)) / (n - 4));
      const y = c.y + r * Math.sin((pi2 * (j - qu + 1)) / (n - 4));
      const z = c.z;
      positions.push(x, y, z);

      const u0 = side === 1 ? 0 : 1;
      uvs.push(u0 + side * (0.5 + x / w), 0.5 + y / h);
    }
  }

  function makeFrame(n, sidx, sif, sib) {
    let a, b, c, d, xf, yf, zf, xb, yb, zb;
    const pif = sif * 3; // position start index  front
    const pib = sib * 3; // position start index back
    let st = [];

    let idx = sidx;

    for (let j = 0; j < n; j++) {
      a = idx;
      b = idx + 1;
      c = idx + 2;
      d = idx + 3;

      indices.push(a, b, d, a, d, c);

      idx += 2;
    }

    for (let j = 0; j < n; j++) {
      const j3 = j * 3;

      xf = positions[pif + j3];
      yf = positions[pif + j3 + 1];
      zf = positions[pif + j3 + 2];

      xb = positions[pib + j3];
      yb = positions[pib + j3 + 1];
      zb = positions[pib + j3 + 2];

      positions.push(xf, yf, zf, xb, yb, zb);

      if (j === 0) st = [xf, yf, zf, xb, yb, zb]; // memorize

      const v = j / n; // here only independent of section height
      uvs.push(0, v, 1, v);
    }

    positions.push(st[0], st[1], st[2], st[3], st[4], st[5]); // end = start
    uvs.push(0, 1, 1, 1);
  }
}

export default RoundedBoxFlat;
