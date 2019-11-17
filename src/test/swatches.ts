import { getFromNodeVibrant } from "../palette-generator/NodeVibrant";
import { readFileSync } from "fs";
import { getFromQuantize } from "../palette-generator/Quantize";
import mime = require('mime')
import { RMSwatch } from "../lib/get-swatch";

const path = "./sample/1.jpeg"
const buffer = readFileSync(path)
const mimep = mime.getType(path) || "image/png"
if(!mimep) console.log('failed to get mime type')

Promise.all([
    getFromNodeVibrant(buffer,{quality:1}),
    getFromQuantize(buffer,{mime:mimep,colorCount:10}),
]).then((palette) => {
  const sumPalette:RMSwatch[] = []
  palette.forEach(v=>sumPalette.push(...v))
  console.log(sumPalette)
})