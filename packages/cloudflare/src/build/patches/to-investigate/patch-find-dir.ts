import { NextjsAppPaths } from "../../../nextjs-paths";
import { existsSync } from "node:fs";

/**
 * Here we patch `findDir` so that the next server can detect whether the `app` or `pages` directory exists
 * (source: https://github.com/vercel/next.js/blob/ba995993/packages/next/src/lib/find-pages-dir.ts#L4-L13)
 * (usage source: https://github.com/vercel/next.js/blob/ba995993/packages/next/src/server/next-server.ts#L450-L451)
 * Note: `findDir` uses `fs.existsSync` under the hood, so patching that should be enough to make this work
 */
export function patchFindDir(code: string, nextjsAppPaths: NextjsAppPaths): string {
  console.log("# patchFindDir");
  return code.replace(
    "function findDir(dir, name) {",
    `function findDir(dir, name) {
			if (dir.endsWith(".next/server")) {
			if (name === "app") return ${existsSync(`${nextjsAppPaths.standaloneAppServerDir}/app`)};
			if (name === "pages") return ${existsSync(`${nextjsAppPaths.standaloneAppServerDir}/pages`)};
		}
		throw new Error("Unknown findDir call: " + dir + " " + name);
		`
  );
}
