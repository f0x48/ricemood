export function syntaxErr(...msg:any[]) {
  console.error(`[ricemood-parser]`,...msg,'Exitting...')
  process.exit()
}

export function log(...msg:any[]) {
  console.log('[ricemood-info]',...msg)
}