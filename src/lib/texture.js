import { SRGBColorSpace } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

const colors = ["red", "green", "blue", "yellow"];
const values = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "plus2",
  "reverse",
  "block",
];
const textureMap = {};

colors.forEach((color) =>
  values.forEach((value) => {
    textureMap[`${color}/${value}`] = new TextureLoader().load(
      `src/assets/cards/${color}/${value}.png`
    );
    textureMap[`${color}/${value}`].colorSpace = SRGBColorSpace;
  })
);

const special = ["black/plus4", "black/changecolor"];
const path = ["black/plus4", "black/changecolor"];
for (let j = 0; j < 2; j++) {
  for (let i = 0; i < 4; i++) {
    textureMap[special[j]] = new TextureLoader().load(
      `src/assets/cards/` + path[j] + `.png`
    );

    textureMap[special[j]].colorSpace = SRGBColorSpace;
  }
}

textureMap["back"] = new TextureLoader().load(`src/assets/cards/back.png`);
textureMap[`back`].colorSpace = SRGBColorSpace;

export default textureMap;
