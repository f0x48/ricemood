export type alias = (string | RegExp)[];
export type RMSwatch = [alias, number[]];
export type RMSwatchGenerator = (buffer: Buffer) => Promise<RMSwatch[]>;

import { readFileSync } from "fs";
import { getFromNodeVibrant } from "../palette-generator/NodeVibrant";
import mime from "mime";
import Color from "color";
import { log } from "./log";

function getSwatch(filepath: string,quality:number = 1): Promise<RMSwatch[]> {
  // read file
  const buffer = readFileSync(filepath);
  const mimep = mime.getType(filepath) || "image/png";

  if (!mimep) console.log("failed to get mime type");

  // get the palette from nodevibrant
  return Promise.all([getFromNodeVibrant(buffer, { quality })]).then(
    palette => {
      const sumPalette: RMSwatch[] = [];
      palette.forEach(v => sumPalette.push(...v));
      return sumPalette;
    }
  );
}

const regex = /\@(\w+)/;
function parseSwatchStr(str: string, swatch: RMSwatch[]): Color | undefined {
  const match = str.match(regex);


  // check if match exist
  if (match && match[1]) {
    // return the color if alias or full is the same as match
    const find = swatch.find(([v]) => v[0] == match[1] || v[1] == match[1]);
    if (find) return Color(find[1]);
  }
  return undefined;
}
export { getSwatch, parseSwatchStr };
