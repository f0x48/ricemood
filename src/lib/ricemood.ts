import { parsePipe } from "./parse-pipe";
import { parseFormat } from "./parse-format";
import { RMSwatch, parseSwatchStr } from "./get-swatch";
import { err } from "./log";

interface variableParsersReturn {
  error?: string;
  str?: string;
  rgb?: number[]
}

export class RMParser {
  palette: RMSwatch[];
  readonly delimiter: string[];
  readonly delimiterRegExp: RegExp;

  constructor(
    palette: RMSwatch[],
    delimiter: string[] = ["\\^r", "\\^"]
  ) {
    this.palette = palette;
    this.delimiter = delimiter;

    // create the regexp based on the arguments
    this.delimiterRegExp = new RegExp(
      delimiter[0] + "(.*?)" + delimiter[1],
      "g"
    )
  }
  parseFile(file:string): String {
    // the program core is vanilla javascript string replace LMAO
    // gonna change this method in the future (i hope)
    return file.replace(
      this.delimiterRegExp,
      (_match: string, capture: string): any => {
        const result: variableParsersReturn = this.variableParser(capture);
        if (result.error) err(result.error);
        if (result.str) return result.str;
        // Force Exit if there is nothing to return.
        return process.exit(1);
      }
    );
  }
  addSwatch(...swatch:RMSwatch[]) {
    // add swatch to current palette
    this.palette.push(...swatch)
  }
  variableParser(str: string,outputString:boolean = true): variableParsersReturn {

    // Find the specified swatch
    let color = parseSwatchStr(str,this.palette)
    if (!color) return { error: `Invalid swatch name ${str}` };

    // Process the pipes
    color = parsePipe(str, color);

    if(!outputString) return {rgb:color.rgb().array()}
    // parse the choosen format and return the string
    return { str: parseFormat(str,color) };
  }
}
