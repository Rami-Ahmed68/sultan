const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../config/.env" });

// api error method
const ApiErrors = require("../../utils/validation_error");

// create cloudinary configration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

const delete_cloudinary_images = async (image, next) => {
  try {
    // split the omage url
    const Image_url = image.split("/");

    // extract the image publick Id
    const publicId = Image_url[Image_url.length - 1].split(".")[0];

    // delete the image from cloudinary by his public It
    const Data = await cloudinary.uploader.destroy(publicId);

    // return the data
    return Data;
  } catch (error) {
    // return th error
    return next(
      new ApiErrors(
        JSON.stringify({
          english: `${error} ...`,
          arabic: "... عذرا خطأ حدث اثناء حذف الصورة",
        }),
        500
      )
    );
  }
};

module.exports = delete_cloudinary_images;
