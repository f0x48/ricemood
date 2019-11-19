import P = require("commander");

P.option("-i, --image <path>", "path to target image")
  .option("-f, --file <path>", "path to file that gonna be parsed ")
  .option("-s, --swatch <path>", "path to swatch json file ")
  .option("-a, --apply [file]", "apply from configuration file")
  .parse(process.argv);

const O = P.opts();
// check if any options provided
if (Object.values(O).filter(v => v != undefined).length < 1) {
  const helpStr = `
       _
      (_)
  _ __ _  ___ ___
 | '__| |/ __/ _ \\          _
 | |  | | (_|  __/         | |
 |_|__|_|\\___\\___| ___   __| |
 | '_ ' _ \\ / _ \\ / _ \\ / _' |
 | | | | | | (_) | (_) | (_| |
 |_| |_| |_|\\___/ \\___/ \\__,_|

${P.helpInformation()}`;
  P.helpInformation = () => helpStr;
  P.help();
}

type combination = [any[], (...p: any) => void];
const combinations: combination[] = [
  [["image"], justGetSwatch],
  [["image", "file"], parseFull],
  [["image", "swatch"], parseFromProvidedSwatch],
  [["apply"], applyFromConfigFile]
];

for (let [keys, func] of combinations) {
  const itIs = Object.keys(O).every(key => !!O[key] == keys.includes(key));
  if (!itIs) continue;
  func(...keys.map(key => O[key]));
  break;
}

async function justGetSwatch(imagepath: string) {
  const { getSwatch } = await import("../lib/get-swatch");
  const beautify = require("json-beautify");
  getSwatch(imagepath).then(swatch => {
    console.log(beautify(swatch, null, 2, 80));
  });
}

async function parseFull(imagepath: string, filepath: string) {
  const { readFileSync } = await import("fs");
  const { RMParser } = await import("../lib/ricemood");
  const { getSwatch } = await import("../lib/get-swatch");
  const file = readFileSync(filepath).toString();

  getSwatch(imagepath).then(palette => {
    const parser = new RMParser(palette);
    const parsedFile = parser.parseFile(file);
    console.log(parsedFile);
  });
}

async function applyFromConfigFile(configfile: any) {
  if(typeof configfile == "boolean") configfile = undefined
  const config = await getConfig(configfile);
  const { applyConfig } = await import("../lib/apply-config");

  if (config) applyConfig(config.ini, config.cfg);
}

function parseFromProvidedSwatch(imagepath: string, swatch: any) {}

async function getConfig(cfgfile: string) {
  return (await import("../lib/config")).getConfig(cfgfile);
}
