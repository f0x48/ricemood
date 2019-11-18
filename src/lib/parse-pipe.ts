import Color = require("color");
import { syntaxErr } from "./log";
import ColorProperties from "./color-pipes";


/**
 * Match[2] : Function name
 * Match[4] : Parameter
 */
const pipeRegex = />((\w+)(\((.*?)\))?)/g;

export function parsePipe(str: string, color: Color): Color {
  let match: RegExpExecArray | any;
  while (true) {
    match = pipeRegex.exec(str);
    if (match == null) break;

    const fn = { name: match[2], param: match[4] };

    let found: boolean = false;
    for (let [alias, full, pipe, dparam] of ColorProperties) {
      if (alias == fn.name || full == fn.name) {
        if(!dparam && fn.param != undefined)
          syntaxErr(
            `Pipe name ${fn.name} didn't require any parameter. Write it as ">${fn.name}" instead of "${match[0]}"`)
        if(fn.param) fn.param = Number(fn.param)
        color = pipe(color, fn.param || dparam);
        found = true;
        break;
      }
    }
    if (!found) syntaxErr(`Pipe name ${fn.name} not found`);
  }
  return color;
}
