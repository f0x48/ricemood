const child_process = require('child_process')
const result = child_process.execFileSync("src/test/testscript.py")
console.log(result.toString())

