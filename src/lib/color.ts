import NodeVibrant = require('node-vibrant')
import { Swatch, Palette } from 'node-vibrant/lib/color'

NodeVibrant.from("../sample/2.jpg").quality(2).getPalette().then(pallete => {
  for(let swatch in pallete) {
    const ps:Swatch = pallete[swatch]!
    console.log(`${swatch} | ${ps.getHex()} | ${ps.getBodyTextColor()} | ${ps.getTitleTextColor()}`)
  }
})

