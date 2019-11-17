import { readFileSync, readFile } from "fs"
import { getSwatch, RMSwatch } from "./lib/get-swatch"
import { RMParser } from "./lib/ricemood"
const jsonbeautify = require('json-beautify')


const arg = process.argv.slice(2)
const image_path = arg[0]
const file_path = arg[1]


const outputPalette:{imageFile:string,palette?:RMSwatch[]} = {
  imageFile:image_path
}

if(arg.length == 1) {
  getSwatch(image_path).then(palette=> {
    outputPalette.palette = palette
    console.log(jsonbeautify(outputPalette,null,2,80))
  })
}
if(arg.length == 2) {
  getSwatch(image_path).then(palette => {
    const Parser = new RMParser(readFileSync(file_path).toString(),palette)
    Parser.parseFile()
  })
}

