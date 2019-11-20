// import {RMSwatchGenerator, RMSwatch} from '../lib/get-swatch'
// import GetPixels = require('get-pixels')
// import Quantize = require('quantize')
// import { RMParser } from '../lib/ricemood'
// import { createPixelArray } from '../lib/color-func'


// const getFromQuantize = function (buffer:Buffer,options : {colorCount:number,mime:string,quality?:number}) : Promise<RMSwatch[]> {
//   return new Promise((re,er) => {
//     GetPixels(buffer,options.mime, (err:any,pixels) => {
//       if(err)er(err)
//       const qu = Quantize(createPixelArray(pixels,options.quality),options.colorCount)
//       if(!qu)er(qu+'quantize')
//       const palette = qu.palette()
//       const result:RMSwatch[] =palette.map((rgb,i) => {
//         return [[`Q${i}`,`Quantize${i}`],rgb]
//       })
//       re(result)
//     })
//   })
// }
// export {getFromQuantize}