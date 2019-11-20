import os = require("os");
import { join, dirname } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import ini from "ini";
import { err, log } from "./log";
import { getWallpaper, detectWallpaperManager } from "./wallpaper-grabber";
export { getConfig };

const homeDirectory = os.homedir();
const env = process.env;

export const configpath =
  env.XDG_CONFIG_HOME ||
  (homeDirectory ? join(homeDirectory, ".config") : undefined);

export interface RMConfig {
  ini: any;
  cfg: {
    folder: string;
    file: string;
    content: string;
  };
}

function getConfig(customConfigFile?: string): RMConfig | undefined {
  const cfg = { folder: "", file: "", content: "" };

  // if custom config file is provided
  if (customConfigFile) {
    cfg.folder = dirname(customConfigFile);
    cfg.file = customConfigFile;

    // check if the file existt
    if (!existsSync(cfg.file)) err(`${cfg.file} doesn't exist`);

    cfg.content = readFileSync(cfg.file).toString();
  } else if (configpath) {
    // get the config folder
    const ricemoodConfigPath = join(configpath, "ricemood");
    cfg.folder = ricemoodConfigPath;
    // create the config folder if not exist yet
    if (!existsSync(ricemoodConfigPath)) mkdirSync(ricemoodConfigPath);

    // ricemoon.ini is the config file
    cfg.file = join(cfg.folder, "ricemood.ini");

    // write default config if file not exist
    if (!existsSync(cfg.file)) {
      writeFileSync(cfg.file, defaultConfig());
    } else cfg.content = readFileSync(cfg.file).toString();
  }
  // parse the config and return
  if (!cfg.file) err("No config file found");
  return { ini: ini.parse(cfg.content), cfg };
}

function defaultConfig(): string {
  log("detecting wallpaper manager");
  const wallpaper = detectWallpaperManager();
  if (!wallpaper)
    log(
      "ricemood failed to detect wallpaper manager, please specify your image file or write your own script"
    );
  else log(`wallpaper manager [${wallpaper}] selected`)
  return `\

;; both are RegExp
tag_start = \\^r
tag_end   = \\^

;; x times image scaled down ; 1 mean original
quality   = 1

;; get wallpaper manager ($feh,$nitrogen)
imagefile = $${wallpaper}
;imagefile_script = ~/getmyimage.sh

;; see example : 
;; https://github.com/fhadiel/ricemood/tree/master/sample

`;
}
