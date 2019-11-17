export type alias = (string | RegExp)[]
export type RMSwatch = [alias,Vec3]
export type RMSwatchGenerator = (buffer:Buffer) => Promise<RMSwatch[]>

import { readFileSync } from 'fs'
import { Vec3 } from 'node-vibrant/lib/color'
import { getFromNodeVibrant } from '../palette-generator/NodeVibrant'
import { getFromQuantize } from '../palette-generator/Quantize'
import mime from 'mime'
import Color from 'color'


function getSwatch(filepath:string): Promise<RMSwatch[]> {
  const buffer = readFileSync(filepath)
  const mimep = mime.getType(filepath) || "image/png"

  
  if(!mimep) console.log('failed to get mime type')

  return Promise.all([
      getFromNodeVibrant(buffer,{quality:1}),
      getFromQuantize(buffer,{mime:mimep,colorCount:10}),
  ]).then((palette) => {
    const sumPalette:RMSwatch[] = []
    palette.forEach(v=>sumPalette.push(...v))
    return sumPalette
  })
}

const regex = /\@(\w+)/
function parseSwatchStr(str:string,swatch:RMSwatch[]) : Color | undefined {
  const match = str.match(regex)
  if(match && match[1]) {
    const find = swatch.find(([v])=>v[0] == match[1] || v[1] == match[1])
    if(find) return Color(find[1])
  }
  return undefined
}
export {getSwatch,parseSwatchStr}
