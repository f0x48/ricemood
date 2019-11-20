import { homedir } from "os";

const hdir = homedir()

export function resolvePath(str:string) : string{
  return str.replace("~",hdir)
}