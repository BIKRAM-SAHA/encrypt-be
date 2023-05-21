import path from "path";
import Jimp from "jimp";
import { writeFileSync } from "fs";

export const encrypt = async (filePath) => {
  // get the current working directory
  const cwd = process.cwd();

  // join the filePath with the cwd
  const fullPath = path.join(cwd, filePath);

  // read the image
  // get the base name of the file
  const fileName = path.basename(fullPath);

  // remove the extension from the file name
  const fileNameWithoutExtension = fileName.split(".")[0];

  const image = await Jimp.read(fullPath);

  // get the image extension using jimp
  const extension = image.getExtension();

  // handle the outputImageFileName flag
  let outputImageFile = `${fileNameWithoutExtension}_encrypted.${extension}`;

  // handle outputKeyFileName flag
  let outputKeyFile = `${fileNameWithoutExtension}_key.txt`;

  // start encryption //

  // get the rgba values of the image
  const rgba = image.bitmap.data;

  // get the length of the rgba array
  const length = rgba.length;

  // generate random key for encryption for each pixel between 0 and 255
  const key = [];
  for (let i = 0; i < length; i++) {
    key.push(Math.floor(Math.random() * 256));
  }

  // loop through the rgba array
  await new Promise((resolve) => {
    for (let i = 0; i < length; i++) {
      const k = key[i];
      rgba[i] = rgba[i] ^ k;
    }

    // save the image with _encrypted appended to the file name, mimeType and the new extension
    image.bitmap.data = rgba;
    resolve();
  });

  await image.writeAsync(outputImageFile);

  // save key to key.txt
  writeFileSync(outputKeyFile, Buffer.from(key).toString("base64"));

  return [outputImageFile, outputKeyFile];
};
