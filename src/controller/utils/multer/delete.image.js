const fs = require("fs");
const ApiErrors = require("../validation_error");

const DeleteImage = (image, next) => {
  // delete the image
  fs.unlink(image.path, (error) => {
    if (error) {
      return next(new ApiErrors(error, 500));
    }
  });
};

module.exports = DeleteImage;
