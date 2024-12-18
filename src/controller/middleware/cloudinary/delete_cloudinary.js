const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../config/.env" });
const path = require("path");

// api error method
const ApiErrors = require("../../../controller/middleware/validation_error/validation_error");

// create cloudinary configration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

const DeleteCloudinary = async (image, next) => {
  try {
    // split the omage url
    const Image_data = image.split("/");

    // extract the image publick Id
    const publicId = Image_data[Image_data.length - 1].split(".")[0];

    // delete the image from cloudinary by his public It
    const Data = await cloudinary.uploader.destroy(publicId);

    // return the data
    return Data;
  } catch (error) {
    // return th error
    return next(new ApiErrors(error, 500));
  }
};

module.exports = DeleteCloudinary;
