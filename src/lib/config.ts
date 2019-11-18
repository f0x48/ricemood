import os = require("os");
import { join } from "path";
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync
} from "fs";
import ini from "ini";
import { syntaxErr } from "./log";
export { getConfig };

const homeDirectory = os.homedir();
const env = process.env;

export const configpath =
  env.XDG_CONFIG_HOME ||
  (homeDirectory ? join(homeDirectory, ".config") : undefined);

interface RMConfig {
  ini: any;
  cfg: {
    configpath: string;
    configfilepath: string;
  };
}

function getConfig(configfile?: string): RMConfig | undefined {
  let config = `\
; both are RegExp
tag_start = \\$RM
tag_end   = \\$
; automatically get wallpaper ($WALLPAPER)
imagefile = $WALLPAPER`;

  if (configpath) {
    const ricemoodConfigPath = join(configpath, "ricemood");
    if (!existsSync(ricemoodConfigPath)) mkdirSync(ricemoodConfigPath);
    const cfg = { folder: ricemoodConfigPath, file: "", content: "" };
    cfg.file = join(cfg.folder, "ricemood.ini");

    // write default config if file not exist
    if (!existsSync(cfg.file)) writeFileSync(cfg.file, config);
    else config = readFileSync(cfg.file).toString();

    cfg.content = config;
    return parse(config, cfg);
  }
  syntaxErr("Config File not Found");
}

function parse(config: string, cfg: object): any {
  return { ini: ini.parse(config), cfg };
}
