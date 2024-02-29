import calculateCoords from "@/lib/card_fanning";

const coordsCache = {
  0: [],
};

const newCardCoords = (n) => {
  if (coordsCache[n]) return coordsCache[n];
  const coords = calculateCoords(n, 1500, 200, 400, "N", 0.4);
  const m = Math.floor(n / 2);
  let centerx;
  if (n % 2 == 0) {
    centerx = (coords[m - 1].x + coords[m].x) / 2;
    for (let i = 0; i < n; i++) {
      coords[i].x = coords[i].x - centerx;
    }
  } else {
    centerx = coords[m].x;
    for (let i = 0; i < n; i++) {
      coords[i].x = coords[i].x - centerx;
    }
  }
  coordsCache[n] = coords;

  return coords;
};

export default newCardCoords;
