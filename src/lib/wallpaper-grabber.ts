import { log, err } from "./log";
import {
  existsSync,
  readFile,
  readFileSync,
  fstat,
  Stats,
  stat,
  statSync
} from "fs";
import wallpaper = require("wallpaper");
import { resolvePath } from "./fs-plus";

type path = string;
interface wallpaperManager {
  [key: string]: {
    configfile: path;
    proc: (file: Buffer) => path | undefined;
  };
}
const wallpaperManagers: wallpaperManager = {
  feh: {
    configfile: "~/.fehbg",
    proc: file => {
      const match = file.toString().match(/--bg[-\w]+ '(.*?)'/);
      if (match && match[1]) return match[1];
    }
  },
  nitrogen: {
    configfile: "~/.config/nitrogen/bg-saved.cfg",
    proc: file => {
      const match = file.toString().match(/file=(.*)/);
      if (match && match[1]) return match[1];
    }
  }
};

function getWallpaper(determined: string): string | undefined {
  // check if we have handler for the given wallpaper manager
  if (determined in wallpaperManagers) {
    log(`You select ${determined} for background manager`);
    let { configfile, proc } = wallpaperManagers[determined];
    configfile = resolvePath(configfile) 
    // check if the configuration file exist
    if (!existsSync(configfile))
      err(`${determined} configuration file "${configfile} not found"`);

    // get the wallpaper path
    const wallpaperPath = proc(readFileSync(configfile));
    if (!wallpaperPath)
      err(
        `Wallpaper path not found in ${determined} configuration file "${configfile}"`
      );
    else if (!existsSync(wallpaperPath)) {
      err(`${wallpaperPath} not found`);
    } else return wallpaperPath;
  }
  err(`${determined} wallpaper manager not found`);
}

function detectWallpaperManager() : string {

  let newest:[string,number] = ["",-Infinity]
  for(let key in wallpaperManagers) {
    const stat = getStat(resolvePath(wallpaperManagers[key].configfile)) 
    if(!stat) continue
    if(stat.atimeMs > newest[1]) newest = [key,stat.atimeMs]
  }
  return newest[0]
}
function getWallpaperFromConfigVariable(str:string) {
  const regex = /^\$(.*)/
  const match = str.match(regex)
  if(match && match[1]) {
    return getWallpaper(match[1])
  }
}

function getStat(filepath: string): Stats | undefined {
  if (existsSync(filepath)) {
    return statSync(filepath);
  }
}


export { getWallpaper, detectWallpaperManager, getWallpaperFromConfigVariable};
