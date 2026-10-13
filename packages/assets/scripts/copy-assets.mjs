import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const sourceDir = path.join(rootDir, "src", "covers");
const destinationDir = path.join(rootDir, "dist", "covers");

await mkdir(destinationDir, { recursive: true });

await cp(sourceDir, destinationDir, {
  recursive: true,
  force: true,
});

console.log("Assets copied to dist/covers");