import red0 from "./cards/red/0.png";
import red1 from "./cards/red/1.png";
import red2 from "./cards/red/2.png";
import red3 from "./cards/red/3.png";
import red4 from "./cards/red/4.png";
import red5 from "./cards/red/5.png";
import red6 from "./cards/red/6.png";
import red7 from "./cards/red/7.png";
import red8 from "./cards/red/8.png";
import red9 from "./cards/red/9.png";
import redblock from "./cards/red/block.png";
import redplus2 from "./cards/red/plus2.png";
import redreverse from "./cards/red/reverse.png";

import yellow0 from "./cards/yellow/0.png";
import yellow1 from "./cards/yellow/1.png";
import yellow2 from "./cards/yellow/2.png";
import yellow3 from "./cards/yellow/3.png";
import yellow4 from "./cards/yellow/4.png";
import yellow5 from "./cards/yellow/5.png";
import yellow6 from "./cards/yellow/6.png";
import yellow7 from "./cards/yellow/7.png";
import yellow8 from "./cards/yellow/8.png";
import yellow9 from "./cards/yellow/9.png";
import yellowblock from "./cards/yellow/block.png";
import yellowplus2 from "./cards/yellow/plus2.png";
import yellowreverse from "./cards/yellow/reverse.png";

import green0 from "./cards/green/0.png";
import green1 from "./cards/green/1.png";
import green2 from "./cards/green/2.png";
import green3 from "./cards/green/3.png";
import green4 from "./cards/green/4.png";
import green5 from "./cards/green/5.png";
import green6 from "./cards/green/6.png";
import green7 from "./cards/green/7.png";
import green8 from "./cards/green/8.png";
import green9 from "./cards/green/9.png";
import greenblock from "./cards/green/block.png";
import greenplus2 from "./cards/green/plus2.png";
import greenreverse from "./cards/green/reverse.png";

import blue0 from "./cards/blue/0.png";
import blue1 from "./cards/blue/1.png";
import blue2 from "./cards/blue/2.png";
import blue3 from "./cards/blue/3.png";
import blue4 from "./cards/blue/4.png";
import blue5 from "./cards/blue/5.png";
import blue6 from "./cards/blue/6.png";
import blue7 from "./cards/blue/7.png";
import blue8 from "./cards/blue/8.png";
import blue9 from "./cards/blue/9.png";
import blueblock from "./cards/blue/block.png";
import blueplus2 from "./cards/blue/plus2.png";
import bluereverse from "./cards/blue/reverse.png";

import blackchangecolor from "./cards/black/changecolor.png";
import blackplus4 from "./cards/black/plus4.png";

import card_back from "./cards/back.png";

import hero from "./hero.png";

const cards = {
  yellow: {
    0: yellow0,
    1: yellow1,
    2: yellow2,
    3: yellow3,
    4: yellow4,
    5: yellow5,
    6: yellow6,
    7: yellow7,
    8: yellow8,
    9: yellow9,
    block: yellowblock,
    plus2: yellowplus2,
    reverse: yellowreverse,
  },

  red: {
    0: red0,
    1: red1,
    2: red2,
    3: red3,
    4: red4,
    5: red5,
    6: red6,
    7: red7,
    8: red8,
    9: red9,
    block: redblock,
    plus2: redplus2,
    reverse: redreverse,
  },

  blue: {
    0: blue0,
    1: blue1,
    2: blue2,
    3: blue3,
    4: blue4,
    5: blue5,
    6: blue6,
    7: blue7,
    8: blue8,
    9: blue9,
    block: blueblock,
    plus2: blueplus2,
    reverse: bluereverse,
  },

  green: {
    0: green0,
    1: green1,
    2: green2,
    3: green3,
    4: green4,
    5: green5,
    6: green6,
    7: green7,
    8: green8,
    9: green9,
    block: greenblock,
    plus2: greenplus2,
    reverse: greenreverse,
  },

  black: {
    changecolor: blackchangecolor,
    plus4: blackplus4,
  },
} as const;

export { card_back, cards, hero };
