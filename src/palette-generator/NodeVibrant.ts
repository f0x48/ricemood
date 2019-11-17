import NodeVibrant = require('node-vibrant')
import { RMSwatchGenerator, alias, RMSwatch } from '../lib/get-swatch'
import { Options } from 'node-vibrant/lib/typing'

const aliases:alias[] = [
  ["V", "Vibranssat"],
  ["LV", "LightVibrant"],
  ["DV", "DarkVibrant"],
  ["M", "Muted"],
  ["LM", "LightMuted"],
  ["DM", "DarkMuted"]
]

const getFromNodeVibrant = function(buffer:Buffer,opts:any) : Promise<RMSwatch[]> {
  return new Promise((re,er)=>{
    const nv = new NodeVibrant(buffer)

    // assign the options
    Object.assign(nv.opts,opts)
    nv.getPalette().then(swatches => {
      const RMSwatches:RMSwatch[] = []
      for(let swatchKey in swatches) {
        for(let alias of aliases) {
          if(alias[1] == swatchKey) {
            RMSwatches.push([alias,swatches[swatchKey]!.getRgb()])
            break;
          }
        }
      }
      re(RMSwatches)
    })
  })
}
export {getFromNodeVibrant}