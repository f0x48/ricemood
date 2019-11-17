import Color = require("color");
import { syntaxErr } from "./syntax-err";
import { bodyTextColor, titleTextColor } from "./color-func";
type Alias = string | RegExp;
type Param = number;
// Use keyof to validate if function name is exist

interface colorFunc {
  (color: Color, param: number): Color;
}
type colorProperties = [Alias, string, colorFunc, Param?];

/**
 * Match[2] : Function name
 * Match[4] : Parameter
 */
const pipeRegex = />((\w+)(\((.*?)\))?)/g;

export function parsePipe(str: string, color: Color): Color {
  let match: RegExpExecArray | any;
  while (true) {
    match = pipeRegex.exec(str);
    if (match == null) break;

    const fn = { name: match[2], param: match[4] };

    console.log(`${fn.name} ${fn.param}`);
    let found: boolean = false;
    for (let [alias, full, pipe, dparam] of ColorProperties) {
      if (alias == fn.name || full == fn.name) {
        if(!dparam && fn.param != undefined)
          syntaxErr(
            `Pipe name ${fn.name} didn't require any parameter. Write it as ">${fn.name}" instead of "${match[0]}"`)
        if(fn.param) fn.param = Number(fn.param)
        color = pipe(color, fn.param || dparam);
        found = true;
        break;
      }
    }
    if (!found) syntaxErr(`Pipe name ${fn.name} not found`);
  }
  return color;
}
const ColorProperties: colorProperties[] = [
  ["gr", "grayscale", c => c.grayscale()],
  ["ne", "negate", c => c.negate()],
  
  ["btc","bodyTextColor", c => Color(bodyTextColor(c.rgb().array()))],
  ["ttc","titleTextColor", c => Color(titleTextColor(c.rgb().array()))],

  ["dk", "darken", (c, p) => c.darken(p), 0.5],
  ["lg", "lighten", (c, p) => c.lighten(p), 0.5],

  ["de", "desaturate", (c, p) => c.desaturate(p), 0.5],
  ["sa", "saturate", (c, p) => c.saturate(p), 0.5],

  ["wh", "whiten", (c, p) => c.whiten(p), 0.5],
  ["bl", "blacken", (c, p) => c.blacken(p), 0.5],

  ["fa", "fade", (c, p) => c.fade(p), 0.5],
  ["op", "opaquer", (c, p) => c.opaquer(p), 0.5],

  ["ro", "rotate", (c, p) => c.rotate(p), 90],

  ["r", "red", (c, p) => c.red(p), 255],
  ["g", "green", (c, p) => c.green(p), 255],
  ["b", "blue", (c, p) => c.blue(p), 255],

  ["h", "hue", (c, p) => c.hue(p), 255],
  ["s", "saturationl", (c, p) => c.saturationl(p), 255],
  ["l", "lightness", (c, p) => c.lightness(p), 255]
];
