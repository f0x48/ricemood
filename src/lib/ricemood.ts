import Color = require("color");
import { parsePipe } from "./parse-pipe";
import { parseFormat } from "./parse-format";
import { RMSwatch, parseSwatchStr } from "./get-swatch";
import { syntaxErr } from "./log";

interface variableParsersReturn {
  error?: string;
  str?: string;
}

export class RMParser {
  palette: RMSwatch[];
  delimiter: String[];
  delimiterRegExp: RegExp;

  constructor(
    palette: RMSwatch[],
    delimiter: string[] = ["\\$RM", "\\$"]
  ) {
    this.palette = palette;
    this.delimiter = delimiter;
    this.delimiterRegExp = new RegExp(
      delimiter[0] + "(.*?)" + delimiter[1],
      "gm"
    )
  }
  parseFile(file:string): String {
    return file.replace(
      this.delimiterRegExp,
      (_match: string, capture: string): any => {
        const result: variableParsersReturn = this.variableParsers(capture);
        if (result.error) syntaxErr(result.error);
        if (result.str) return result.str;
        // Force Exit if there is nothing to return.
        return process.exit(1);
      }
    );
  }
  variableParsers(vars: string): variableParsersReturn {

    // Find the specified swatch
    let color = parseSwatchStr(vars,this.palette)
    if (!color) return { error: `Invalid swatch name ${vars}` };

    // Process the pipes
    color = parsePipe(vars, color);

    // parse the choosen format and return the string
    return { str: parseFormat(vars,color) };
  }
}
