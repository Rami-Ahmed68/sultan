const fs = require("fs");
const ApiErrors = require("../validation_error");

const DeleteImage = (image, next) => {
  // delete the image
  if (!image) {
    // return error
    return next(
      new ApiErrors(
        JSON.stringify({
          english: "Sorry, no any image to delete ...",
          arabic: "... عذرا لا يوجد اي صورة للحذف",
        }),
        403
      )
    );
  }
  fs.unlink(image.path, (error) => {
    if (error) {
      return next(new ApiErrors(error, 500));
    }
  });
};

module.exports = DeleteImage;
