import { existsSync, readFileSync, writeFileSync } from "fs";
import { err, log } from "./log";
import { getSwatch } from "./get-swatch";
import { join, basename } from "path";
import { RMParser } from "./ricemood";

interface configStructure {
  start_tag?: string;
  end_tag?: string;
  imagefile: string;
  const: { [key: string]: string };
  quality: number;
  [key: string]:
    | any
    | {
        filename: string;
        realfilepath: string;
      };
}

const requiredItem = ["filename", "realfilepath"];
async function applyConfig(c: configStructure, cfgPath: any) {
  const excludeObj = ["const"];

  // get keys from ini file
  const items = Object.keys(c).filter(
    k => c[k] instanceof Object && !excludeObj.includes(k)
  );
  // Get Image from wallpaper if possible
  if (c.imagefile == "$WALLPAPER") {
    const { get } = await import("wallpaper");
    c.imagefile = await get();
    log("getting wallpaper...");
  }

  // check if image exists
  if (!(c.imagefile && existsSync(c.imagefile)))
    err(`imagefile ${c.imagefile} not found`);

  // Take the color palette from the image
  log(`getting color for ${basename(c.imagefile)}`);
  const swatch = await getSwatch(c.imagefile, c.quality);

  // create the parser
  const delimiter =
    c.start_tag && c.end_tag ? [c.start_tag, c.end_tag] : undefined;
  const parser = new RMParser(swatch, delimiter);

  // apply the const from ini file if provided
  if (c.const) {
    const appliedConst = applyConst(c.const, parser);
    log(`Providing variable ${appliedConst.join(", ")}`);
  }
  log(`[CAUTION]
This app is really buggy, this step will overwrite

${items.map(v => c[v].realfilepath).join("\n")}

Please backup those file first
Do you want to proceed? press Y to continue`);

  // Only proceed if user press Y
  process.stdin.on("data", data => {
    // destroy the stdin so the program can stop
    process.stdin.destroy();
    if (data != "Y\n") err("Alright");

    // iterate the configured file
    for (let item of items) {
      const itemo = c[item];

      // check if key is correctly provided
      requiredItem.forEach(v =>
        !itemo[v] ? err(`item [${item}] didn't have ${v}`) : null
      );

      // item filename is relative to configuration file directory
      itemo.filename = join(cfgPath.folder, itemo.filename);

      // read and parse the file
      if (existsSync(itemo.filename)) {
        const parsedFile = parser.parseFile(
          readFileSync(itemo.filename).toString()
        );
        log(`[${item}] writing to ${itemo.realfilepath}`);

        // write to target path
        writeFileSync(itemo.realfilepath, parsedFile);
      }
    }
    log(`Enjoy your new theme!`);
  });
}

interface consts {
  [key: string]: string;
}
// Function to apply user provided variable from config ini file
function applyConst(obj: consts, parser: RMParser): string[] {
  const swatches: string[] = [];

  // iterate the keys
  for (let key in obj) {
    // parse the string using the provided parser and get the rgb value
    const parsed = parser.variableParser(obj[key], false).rgb;
    if (parsed && parsed.length > 1) {
      // add the rgb to parser palette
      parser.addSwatch([[key], parsed]);
      swatches.push(key);
    }
  }
  return swatches;
}
export { applyConfig };
