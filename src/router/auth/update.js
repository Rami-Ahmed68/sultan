const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import the error handling method
const ApiErrors = require("../../controller/utils/validation_error");

// import user model
const User = require("../../model/user/user");

// import uploading avatar
const upload_avatar = require("../../controller/utils/multer/avatar/upload.avatar");

// import deleteing image method
const DeleteImage = require("../../controller/utils/multer/delete.image");

// import hashing password's method
const hash = require("../../controller/utils/password/hash");

// import the compaering passwords method
const compaer = require("../../controller/utils/password/compaer");

// importing the verify token method
const verify_token = require("../../controller/utils/token/verify_token");

// import the validation error method
const validate_error = require("../../controller/middleware/joi_validation/auth/update");

// hashing password method
const hash = require("../../controller/utils/password/hash");

router.put("/", upload_avatar, async (req, res, next) => {
  try {
    // validate the body
    const Error = validate_error(req.body);

    // check if the body data has any error
    if (Error.error) {
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

    // check if the body not empty
    if (
      !req.body.name &&
      !req.body.password &&
      !req.body.description &&
      !req.body.bio &&
      !req.body.whatsapp &&
      !req.body.phone
    ) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english:
              "Sorry, it is not possible to modify without sending new data. ...",
            arabic: "... عذرا لا يمكن التعديل دون ارسال بيانات جديدة",
          }),
          400
        )
      );
    }

    // verify token
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // find the admin by his id
    const admin = await User.findById(verify_token_data._id);

    // check if the admin is exists
    if (!admin) {
      return next(
        new ApiErrors(
          JSON.stringify({
            english: `Sorry, invalid admin not found ...`,
            arabic: `... عذرا لم يتم العثور على الادمن`,
          }),
          404
        )
      );
    }

    // find and update the admin by his id
    const new_admin = await User.findByIdAndUpdate(
      { _id: admin._id },
      {
        name: req.body.name ? req.body.name : "",
        password: req.body.password
          ? await hash(req.body.password)
          : admin.password,
        description: req.body.description
          ? req.body.description
          : admin.description,
        bio: req.body.bio ? req.body.bio : admin.bio,
        whatsapp: req.body.whatsapp ? req.body.whatsapp : admin.whatsapp,
        phone: req.body.phone ? req.body.phone : admin.phone,
      },
      { new: true }
    );

    // create response
    const response = {
      data: _.pick(new_admin, [
        "_id",
        "name",
        "description",
        "bio",
        "whatsapp",
        "phone",
      ]),
    };

    // send the response to clinte
    res.status(200).send(response);
  } catch (error) {
    // check if the request has any image
    if (req.files.length > 0) {
      // delete it
      DeleteImage(req.file, next);
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
