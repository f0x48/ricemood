import Color = require("color");
import { err } from "./log";
import ColorProperties from "./color-pipes";


/**
 * Match[2] : Function name
 * Match[4] : Parameter
 */
const pipeRegex = />((\w+)(\((.*?)\))?)/g;

export function parsePipe(str: string, color: Color): Color {
  let match: RegExpExecArray | any;
  
  // run until didn't find any match
  while (true) {
    match = pipeRegex.exec(str);
    if (match == null) break;

    const fn = { name: match[2], param: match[4] };

    let found: boolean = false;
    for (let [alias, full, pipe, dparam] of ColorProperties) {

      if (alias == fn.name || full == fn.name) {

        // check if the pipe need parameter
        if(!dparam && fn.param != undefined)
          err(
            `Pipe name ${fn.name} didn't require any parameter. Write it as ">${fn.name}" instead of "${match[0]}"`)
        
        // parse the parameter as number
        if(fn.param) fn.param = Number(fn.param)

        // pipe the current color and pass the parameter
        color = pipe(color, fn.param || dparam);
        
        // set found and break the loop
        found = true;
        break;
      }
    }
    // stop the program if didn't find any pipe
    if (!found) err(`Pipe name ${fn.name} not found`);
  }
  return color;
}
