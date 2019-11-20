import Color = require("color");


type dictItem = [string|RegExp,{(clr:Color,p:any) : string}]

/**
 * Example : rgb(--)
 * Match[1] : rgb
 * Match[3] : --
 */
const regex = /\#(\w{0,3})(\(.*?\))?/
const dict:dictItem[] = [
  ["rgb",(c,p) => c.rgb().array().join(p)],
  ["hsl",(c,p) => c.hsl().array().join(p)],
  ["hex",c => c.hex().slice(1)],
  [/^r/, c => c.red().toString()],
  [/^g/, c => c.green().toString()],
  [/^b/, c => c.blue().toString()],
  [/^h/, c => c.hue().toString()],
  [/^s/, c => c.saturationl().toString()],
  [/^l/, c => c.lightness().toString()],
]

export function parseFormat(str:string,color:Color) : string {

  const match = str.match(regex)

  // just give hex and remove the hash if no match found
  if(!match) return color.hex()
  
  const format = match[1]
  const param = match[3]

  
  for(let [id,proc] of dict) {
    // use regex if the id is regex use equal if string
    if((id instanceof RegExp && id.test(format)) || (id == format)) {
      return proc(color,param)
    } 
  }
  // if no match, just return hex
  return color.hex()
}