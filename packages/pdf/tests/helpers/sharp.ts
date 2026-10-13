import sharp from "sharp";

export const IMAGE_SIZE = 32;
export const MAX_MEAN_PIXEL_ERROR = 20;

export async function inspectExtractedImage(
  data: Uint8Array,
): Promise<{
  format: string | undefined;
  width: number;
  height: number;
  channels: 1;
  pixels: Buffer;
}> {
  const result = await sharp(Buffer.from(data))
    .flatten({ background: "#ffffff" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    format: result.info.format,
    width: result.info.width,
    height: result.info.height,
    channels: 1,
    pixels: result.data,
  };
}

export async function normalizeSourceImage(
  filePath: string,
): Promise<Buffer> {
  return sharp(filePath)
    .flatten({ background: "#ffffff" })
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer();
}



export async function normalizeExtractedImage(image: {
  data: Uint8Array;
}): Promise<Buffer> {
  const result = await sharp(Buffer.from(image.data))
    .flatten({ background: "#ffffff" })
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return result.data;
}



export function meanPixelError(a: Buffer, b: Buffer): number {
  if (a.length !== b.length || a.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  let totalDifference = 0;

  for (let i = 0; i < a.length; i++) {
    totalDifference += Math.abs(a[i]! - b[i]!);
  }

  return totalDifference / a.length;
}