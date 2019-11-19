import os = require("os");
import { join, dirname } from "path";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "fs";
import ini from "ini";
import { err } from "./log";
export { getConfig };

const homeDirectory = os.homedir();
const env = process.env;

export const configpath =
  env.XDG_CONFIG_HOME ||
  (homeDirectory ? join(homeDirectory, ".config") : undefined);

interface RMConfig {
  ini: any;
  cfg: {
    folder: string;
    file: string;
    content: string;
  };
}

function getConfig(customConfigFile?: string): RMConfig | undefined {
  const cfg = { folder: "", file: "", content: "" };
  cfg.content = `\
; both are RegExp
tag_start = \\$RM
tag_end   = \\$
; x times image scaled down ; 1 mean original
quality   = 1
; automatically get wallpaper ($WALLPAPER)
imagefile = $WALLPAPER`;

  // if custom config file is provided
  if(customConfigFile) {
    cfg.folder = dirname(customConfigFile)
    cfg.file = customConfigFile

    // check if the file existt
    if(!existsSync(cfg.file)) err(`${cfg.file} doesn't exist`)

    cfg.content = readFileSync(cfg.file).toString()
  }
  else if(configpath) {

    // get the config folder
    const ricemoodConfigPath = join(configpath, "ricemood");
    cfg.folder = ricemoodConfigPath
    // create the config folder if not exist yet
    if (!existsSync(ricemoodConfigPath)) mkdirSync(ricemoodConfigPath);
    
    // ricemoon.ini is the config file
    cfg.file = join(cfg.folder, "ricemood.ini");

    // write default config if file not exist
    if (!existsSync(cfg.file)) writeFileSync(cfg.file, cfg.content);
    else cfg.content = readFileSync(cfg.file).toString();
  }
  // parse the config and return
  return {ini:ini.parse(cfg.content),cfg}
  err("Config File not Found");
}

function parse(config: string, cfg: object): any {
  return { ini: ini.parse(config), cfg };
}
