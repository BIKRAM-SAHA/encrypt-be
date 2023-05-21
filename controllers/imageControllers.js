import { writeFileSync, readFile, unlink } from "fs";
import { resolve } from "path";
import AdmZip from "adm-zip";
import expressAsyncHandler from "express-async-handler";
import { encrypt } from "../helpers/encryptImage.js";
import { decrypt } from "../helpers/decryptImage.js";

// @desc : encrypt image
// @route: POST /
// @access: public
export const encryptImage = expressAsyncHandler(async (req, res) => {
  console.log("req received");
  const imageAsDataURLString = req.body.imageAsDataURL;

  //create an image of the received dataURL
  var string = imageAsDataURLString;
  var regex = /^data:.+\/(.+);base64,(.*)$/;
  var matches = string.match(regex);
  var ext = matches[1];
  var data = matches[2];
  var buffer = Buffer.from(data, "base64");

  const originalImageName = `originalImage${Date.now()}.${ext}`;
  writeFileSync(originalImageName, buffer);
  const [outputImageFileName, outputKeyFileName] = await encrypt(
    originalImageName
  );

  let zip = new AdmZip();
  zip.addLocalFile(resolve(outputImageFileName));
  zip.addLocalFile(resolve(outputKeyFileName));
  const zipName = `files${Date.now()}.zip`;
  zip.writeZip(zipName);

  unlink(resolve(originalImageName), (err) => {
    if (err) throw err;
  });
  unlink(resolve(outputImageFileName), (err) => {
    if (err) throw err;
  });
  unlink(resolve(outputKeyFileName), (err) => {
    if (err) throw err;
  });

  res.download(zipName, (err) => {
    if (err) throw err;
    unlink(resolve(zipName), (err) => {
      if (err) throw err;
    });
  });
});

// @desc : decrypt image
// @route: POST /
// @access: public
export const decryptImage = expressAsyncHandler(async (req, res) => {
  console.log("req received");
  const imageAsDataURLString = req.body.imageAsDataURL;

  //create an image of the received dataURL
  var string = imageAsDataURLString;
  var regex = /^data:.+\/(.+);base64,(.*)$/;
  var matches = string.match(regex);
  var ext = matches[1];
  var data = matches[2];
  const now = Date.now();
  console.log(ext);
  var buffer = Buffer.from(data, "base64");
  const encryptedImageName = `encryptedImage${now}.${ext}`;
  writeFileSync(encryptedImageName, buffer);
  const pathForImage = resolve(encryptedImageName);

  const keyAsDataURLString = req.body.keyAsDataURL;

  //create an image of the received dataURL
  string = keyAsDataURLString;
  regex = /^data:.+\/(.+);base64,(.*)$/;
  matches = string.match(regex);
  ext = "txt";
  data = matches[2];
  console.log(ext);
  buffer = Buffer.from(data, "base64");
  const encryptedKeyFileName = `encryptedImage_key${now}.${ext}`;
  writeFileSync(encryptedKeyFileName, buffer);
  const pathForKey = resolve(encryptedKeyFileName);

  const DecryptedImageName = await decrypt(pathForImage, pathForKey);

  unlink(pathForKey, (err) => {
    if (err) throw err;
  });
  unlink(pathForImage, (err) => {
    if (err) throw err;
  });

  res.download(resolve(DecryptedImageName), (err) => {
    if (err) throw err;
    unlink(resolve(DecryptedImageName), (err) => {
      if (err) throw err;
    });
  });
});
