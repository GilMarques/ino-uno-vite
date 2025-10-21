import * as THREE from "three";

import { card_back, cards } from "../assets";

const textureMap3D: { [key: string]: THREE.Texture } = {};

function loadTextures3D() {
  Object.entries(cards).forEach(([color, values]) => {
    Object.entries(values).forEach(([value, path]) => {
      const tex = new THREE.TextureLoader().load(path);
      tex.colorSpace = THREE.SRGBColorSpace;
      textureMap3D[`${color}/${value}`] = tex;
    });
  });

  textureMap3D["black/plus4"] = new THREE.TextureLoader().load(
    cards["black"]["plus4"]
  );

  textureMap3D["black/changecolor"] = new THREE.TextureLoader().load(
    cards["black"]["changecolor"]
  );

  textureMap3D["black/plus4"].colorSpace = THREE.SRGBColorSpace;
  textureMap3D["black/changecolor"].colorSpace = THREE.SRGBColorSpace;

  textureMap3D["back"] = new THREE.TextureLoader().load(card_back);
  textureMap3D[`back`].colorSpace = THREE.SRGBColorSpace;
}

export { loadTextures3D, textureMap3D };
