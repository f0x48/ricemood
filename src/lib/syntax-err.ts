export function syntaxErr(...msg:any[]) {
  console.error(`[ricemood-parser]`,...msg,'Exitting...')
  process.exit()
}