import { existsSync, readFile, readFileSync, writeFileSync } from "fs";
import { syntaxErr, log } from "./log";
import { getSwatch } from "./get-swatch";
import { join, basename } from "path";
import { RMParser } from "./ricemood";
import { execSync } from "child_process";

async function applyConfig(c: any, cfgPath: any) {
  const items = Object.keys(c).filter(k => c[k] instanceof Object);

  // get imagefile
  if (c.imagefile == "$WALLPAPER") {
    const { get } = await import("wallpaper");
    c.imagefile = await get();
    log("getting wallpaper...");
  }
  if (!(c.imagefile && existsSync(c.imagefile)))
    syntaxErr(`imagefile ${c.imagefile} not found`);

  log(`getting color for ${basename(c.imagefile)}`);
  const swatch = await getSwatch(c.imagefile);

  const parser = new RMParser(swatch);

  log(`\
[CAUTION]
This app is really buggy, this step will overwrite

${items.map(v=>c[v].realfilepath).join('\n')}

Please backup those file first
Do you want to proceed? press Y to continue\
`);
  process.stdin.on("data", data => {
    process.stdin.destroy()
    if (data != "Y\n") syntaxErr("Alright");
    for (let item of items) {
      const itemo = c[item];
      itemo.filename = join(cfgPath.folder, itemo.filename);
      if (existsSync(itemo.filename)) {
        const parsedFile = parser.parseFile(readFileSync(itemo.filename).toString())
        log(`[${item}] writing to ${itemo.realfilepath}`)
        writeFileSync(itemo.realfilepath,parsedFile)
      }
    }
    log(`Enjoy your new theme!`)
  });
}

function validateItem() {}
export { applyConfig };
