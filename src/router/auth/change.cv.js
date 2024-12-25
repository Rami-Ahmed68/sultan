const express = require("express");
const router = express.Router();

// import handling error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the user model
const User = require("../../model/user/user");

// import delete image method
const DeleteImage = require("../../controller/utils/multer/delete.image");

// import verify token method
const VerifyToken = require("../../controller/utils/token/verify_token");

// import validation error method
const validate_error = require("../../controller/middleware/joi_validation/auth/update.cv");

// import upload cv method
const upload_cv = require("../../controller/utils/multer/cv/upload.cv");

// upload the image to cloudinary method
const Upload_Cloudinary = require("../../controller/middleware/cloudinary/upload_cloudinary");

// delete the image from cloudinary method
const delete_cloudinary = require("../../controller/middleware/cloudinary/delete_cloudinary");

router.put("/", upload_cv, async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_error(req.body);

    // check if the body data has any error
    if (Error.error) {
      // delete the image
      DeleteImage(req.file, next);

      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: Error.error.details[0].message,
            arabic: `... عذرا خطأ في البيانات المرسلة`,
          }),
          400
        )
      );
    }

    // check if the request has a file
    if (!req.file) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, you should upload a new image ...",
            arabic: "... عذرا يجب رفع صورة جديدة",
          }),
          400
        )
      );
    }

    // verify token data
    const verify_token_data = await VerifyToken(
      req.headers.authorization,
      next
    );

    // check if the admin id in token is like the id in body
    if (verify_token_data._id != req.body._id) {
      // delete image
      DeleteImage(req.file, next);

      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid header format ...",
            arabic: "... عذرا خطأ في البيانات المرسلة",
          }),
          400
        )
      );
    }

    // find the user
    const admin = await User.findById(req.body._id);

    // check if the admin is exists
    if (!admin) {
      // delete the cv
      DeleteImage(req.file, next);

      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin not found ...",
            arabic: "... عذرا لم يتم العثور على حساب الادمن",
          }),
          400
        )
      );
    }

    // delete the old cv from cloudinary
    await delete_cloudinary(admin.cv, next);

    // upload the new cv
    const new_cv = await Upload_Cloudinary(req.file, "cv", next);

    // update the cv
    admin.cv = new_cv;

    // save the admin after updated the cv
    await admin.save();

    // create response
    const response = {
      messgae: JSON.stringify({
        english: "The CV updated successfully",
        arabic: "تم تعديل السي في بنجاح",
      }),
      cv_url: new_cv,
    };

    // send the response
    res.status(200).send(response);
  } catch (error) {
    // delete the uploaded image
    DeleteImage(req.file, next);

    // return the error
    return next(
      new ApiErrors(
        JSON.stringify({
          english: `${error} ...`,
          arabic: "... عذرا خطأ عام",
        }),
        500
      )
    );
  }
});

module.exports = router;
