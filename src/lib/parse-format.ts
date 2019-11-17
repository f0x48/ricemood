import Color = require("color");


type dictItem = [string|RegExp,{(clr:Color) : string}]

/**
 * Example : rgb(--)
 * Match[1] : rgb
 * Match[3] : --
 */
const regex = /(\w{0,3})(\(.*?\))?/

export function parseFormat(str:string,color:Color) : string {

  const match = str.match(regex)

  // just give hex and remove the hash if no match found
  if(!match) return color.hex().slice(1)
  
  const format = match[1]
  const param = match[3]
  
  const dict:dictItem[] = [
    ["rgb",c => c.rgb().array().join(param)],
    ["hsl",c => c.hsl().array().join(param)],
    [/^r/, c => c.red().toString()],
    [/^g/, c => c.green().toString()],
    [/^b/, c => c.blue().toString()],
    [/^h/, c => c.hue().toString()],
    [/^s/, c => c.saturationl().toString()],
    [/^l/, c => c.lightness().toString()],
  ]

  for(let [id,proc] of dict) {
    if((id instanceof RegExp && id.test(format)) || (id == format)) {
      return proc(color)
    } 
  }
  return color.hex().slice(1)
}