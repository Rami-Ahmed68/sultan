// const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../config/.env" });
const path = require("path");

const cloudinary = require("cloudinary").v2;

// api error method
const ApiErrors = require("../../utils/validation_error");

// create cloudinary configration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

const upload_video_cloudinary = async (file, folder, next) => {
  try {
    // الخيارات الافتراضية للرفع
    const defaultOptions = {
      resource_type: "video",
    };

    // create the video path
    const video_path = path.join(
      __dirname,
      `../../../../public/${folder}/${file.filename}`
    );

    // upload the video
    const result = await cloudinary.uploader.upload(video_path, {
      resource_type: "video",
    });

    // return the uploaded video's url
    return result.secure_url;
  } catch (error) {
    // return the error
    return next(
      new ApiErrors(
        JSON.stringify({
          english: `${error} ...`,
          arabic: "... عذرا خطأ اثناء رفع الفيديو",
        }),
        500
      )
    );
  }
};

module.exports = upload_video_cloudinary;
