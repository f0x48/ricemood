import RM = require('../lib/ricemood')
import NodeVibrant = require('node-vibrant')
import fs = require('fs')
import path = require('path')
import { Swatch } from 'node-vibrant/lib/color'
import canvas = require('canvas')
import Color = require('color')


const fileLoc = __dirname+"/../../sample/kitty-theme.conf"
const file = fs.readFileSync(fileLoc)

// NodeVibrant.from(process.argv[2]).quality(2).getPalette().then(palette => {
//   const parser = new RM.RMParser(file.toString(),palette)
//   console.log(Object.values(palette).map((v:any) => v.hex))
//   const result = parser.parseFile()
  
//   const parsedRes = result.trim().split('\n').map(v=>v.split(' ').map(v=>v.trim()))
//   console.log(parsedRes)

//   console.log('Creating canvas')
//   const w = 200
//   const h = 700
//   const c = canvas.createCanvas(w,h)
//   const ctx = c.getContext('2d')
//   const len = parsedRes.length
//   const s = [w,h/len]
//   for(let i=0 ; i < len ; i++) {
//     const pair = parsedRes[i]
//     ctx.fillStyle = pair[1]
//     ctx.fillRect(0,i*s[1],s[0],s[1])
//     ctx.fillStyle = "white"
//     ctx.font ="12px Ubuntu"
//     ctx.fillText(pair[0], 10 ,i*s[1]+s[1]/2)

//   }
//   console.log(result)
//   fs.writeFileSync(path.join(__dirname,'../../sample/kitty-output.png'),c.toBuffer())

// })
