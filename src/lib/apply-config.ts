import { err, log } from "./log";
import { join, basename, resolve } from "path";
import { RMParser } from "./ricemood";
import { getWallpaperFromConfigVariable } from "./wallpaper-grabber";
import { execFileSync, execSync, spawnSync } from "child_process";
import { resolvePath } from "../lib/fs-plus";

interface configStructure {
  start_tag?: string;
  end_tag?: string;
  imagefile: string;
  imagefile_script: string;
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
  let items = Object.keys(c).filter(
    k => c[k] instanceof Object && !excludeObj.includes(k)
  );
  if (items.length < 1)
    err(`There is no configured file yet. Please edit ${cfgPath.file} first.`);

  if (c.imagefile_script) {
    c.imagefile = execFileSync(
      join(cfgPath.folder, c.imagefile_script)
    ).toString();
    c.imagefile = c.imagefile.trim();
  }
  // Get Image from wallpaper if possible
  else if (c.imagefile.startsWith("$")) {
    const imageFromGrabber = getWallpaperFromConfigVariable(c.imagefile);
    if (imageFromGrabber) c.imagefile = resolvePath(imageFromGrabber);
    log("getting wallpaper...");
  }

  // Optimize load speed
  const { existsSync, readFileSync, writeFileSync } = await import("fs");
  const { getSwatch } = await import("./get-swatch");

  // check if image exists
  if (!(c.imagefile && existsSync(c.imagefile)))
    err(`imagefile ${c.imagefile} not found`);

  displayImage(c.imagefile);
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
  items.forEach(v => {
    c[v].filename = resolvePath(join(cfgPath.folder,c[v].filename));
    c[v].realfilepath = resolvePath(c[v].realfilepath)
  });

  // check if source file is the same as target file
  
  items.forEach(v => {
    if (resolve(c[v].realfilepath, c[v].filename) == '')
      err(`[${v}] ${c[v].filepath} is overwriting itself. Aborting`);
  });
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

    for(let key of items) {
      if('onfinish' in c[key]) {
        log(`[${key}] executing task ${c[key]['onfinish']}`)
        const output = execSync(c[key]['onfinish'])
        log(output.toString())
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
function displayImage(path: string) {
  if (process.env.TERM && process.env.TERM == "xterm-kitty")
    execSync(`kitty +kitten icat "${path}"`);
}
export { applyConfig };
