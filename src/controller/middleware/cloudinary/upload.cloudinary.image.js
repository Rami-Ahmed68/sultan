const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../config/.env" });
const path = require("path");

// api error method
const ApiErrors = require("../../utils/validation_error");

// create cloudinary configration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

const upload_cloudinary_image = async (file, folder, next) => {
  try {
    // create the image path
    const Image_path = path.join(
      __dirname,
      `../../../../public/${folder}/${file.filename}`
    );

    // upload the image to cloudinary
    const data = await cloudinary.uploader.upload(Image_path, {
      resource_type: "auto",
    });

    // return the data
    return data.secure_url;
  } catch (error) {
    return next(
      new ApiErrors(
        JSON.stringify({
          english: `${error} ...`,
          arabic: "... عذرا خطأ اثناء رفع الافاتار",
        }),
        500
      )
    );
  }
};

module.exports = upload_cloudinary_image;
