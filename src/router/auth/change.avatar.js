const express = require("express");
const router = express.Router();

// import handling error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the user model
const User = require("../../model/user/user");

// import delete image method
const DeleteImage = require("../../controller/utils/multer/delete.files");

// import verify token method
const VerifyToken = require("../../controller/utils/token/verify_token");

// import validation error method
const validate_data = require("../../controller/middleware/joi_validation/auth/update.avatar");

// import upload avatar method
const upload_avatar = require("../../controller/utils/multer/avatar/upload.avatar");

// upload the image to cloudinary method
const Upload_Cloudinary = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// delete the image from cloudinary method
const delete_cloudinary = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

router.put("/", upload_avatar, async (req, res, next) => {
  try {
    // check if the requets has more than on emage
    if (req.files && req.files.length > 1) {
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }
    }
    // validate body data
    const Error = validate_data(req.body);

    // check if the body data has any error
    if (Error.error) {
      // delete image
      DeleteImage(req.files[0], next);

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
    if (!req.files[0]) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, you should upload a new avatar ...",
            arabic: "... عذرا يجب رفع افاتار جديد",
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
      DeleteImage(req.files[0], next);

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
      // delete image
      DeleteImage(req.files[0], next);

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

    if (admin.avatar) {
      // delete the old avatar from cloudinary
      await delete_cloudinary(admin.avatar, next);
    }

    // upload the new avatar
    const new_avatar = await Upload_Cloudinary(req.files[0], "avatar", next);

    // update the avatar
    admin.avatar = new_avatar;

    // save the admin after updated the avatar
    await admin.save();

    // delete the image from avatar folder
    DeleteImage(req.files[0], next);

    // create response
    const response = {
      messgae: JSON.stringify({
        english: "Avatar changed successfully",
        arabic: "تم تعديل الافاتار بنجاح",
      }),
      avatar_path: new_avatar,
    };

    // send the response
    res.status(200).send(response);
  } catch (error) {
    // check if the request has any file
    if (req.files && req.files.length > 0) {
      // delete the uploaded image
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }
    }

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
