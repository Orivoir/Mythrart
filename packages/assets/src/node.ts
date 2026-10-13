import { readFile } from "node:fs/promises"

export async function loadDefaultCover(): Promise<Uint8Array> {
  const data = await readFile(
    new URL("./covers/default_cover_image.png", import.meta.url),
  );

  return new Uint8Array(data);
}