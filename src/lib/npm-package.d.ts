
declare module 'quantize' {
  import { Vec3 } from "node-vibrant/lib/color";
  interface colorMap {
    palette() : Vec3[]
    map(aof:number[]) : number[]
  }
  function quantize(source:number[][],colorCount:number):colorMap
  export = quantize
}

declare module 'get-pixels' {
  import { Vec3 } from "node-vibrant/lib/color";
  type callback = (err:any,pixels:any) => any

  function getPixels(souce:string | Buffer | URL ,mime:string, callback:callback) : any
  export = getPixels
}