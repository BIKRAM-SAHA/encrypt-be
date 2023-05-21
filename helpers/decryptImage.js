import path from "path";
import Jimp from "jimp";
import { readFileSync } from "fs";

export const decrypt = async (ImageFilePath, keyFilePath) => {
  const image = await Jimp.read(ImageFilePath);
  const extension = image.getExtension();

  // get the rgba values of the image
  const rgba = image.bitmap.data;

  // get the length of the rgba array
  const length = rgba.length;

  // get the base64 encoded key
  const key = readFileSync(keyFilePath, "utf8");

  // decode the key
  const keyDecoded = Buffer.from(key, "base64");

  const keyArray = Array.from(keyDecoded);

  // loop through the rgba array
  for (let i = 0; i < length; i++) {
    const k = keyArray[i];
    rgba[i] = rgba[i] ^ k;
  }

  // save the image with _decrypted appended to the file name, mimeType and the new extension
  image.bitmap.data = rgba;

  // save the image
  // get file base name before _encrypted
  const fileName = path.basename(ImageFilePath);
  // remove the extension from the file name
  let fileNameWithoutExtension = `${fileName.split(".")[0]}_decrypted`;

  await image.writeAsync(`${fileNameWithoutExtension}.${extension}`);

  return `${fileNameWithoutExtension}.${extension}`;
};
