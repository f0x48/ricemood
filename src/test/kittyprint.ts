import { readFileSync } from "fs"
import { join } from "path"
import { spawnSync, execFileSync, execSync } from "child_process"
import readline from "readline"

const exampleSwatch = ["color 1","#sasa"]
const path = join(__dirname,'../../sample/example-1.png')
const exampleImage = readFileSync(path)

execSync(`kitty +kitten icat --place="10x10" "${path}"`)