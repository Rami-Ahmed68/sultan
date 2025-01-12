const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import the error handling method
const ApiErrors = require("../../controller/utils/validation_error");

// import user model
const User = require("../../model/user/user");

// import hashing password's method
const hash = require("../../controller/utils/password/hash");

// importing the verify token method
const verify_token = require("../../controller/utils/token/verify_token");

// import the validation error method
const validate_error = require("../../controller/middleware/joi_validation/auth/update");

router.put("/", async (req, res, next) => {
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
      !req.body.english_name &&
      !req.body.english_description &&
      !req.body.english_bio &&
      !req.body.arabic_name &&
      !req.body.arabic_description &&
      !req.body.arabic_bio &&
      !req.body.password &&
      !req.body.whatsapp &&
      !req.body.telegram &&
      !req.body.facebook &&
      !req.body.instgram &&
      !req.body.linkedIn &&
      !req.body.behance &&
      !req.body.email_address &&
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
        english_name: req.body.english_name
          ? req.body.english_name
          : admin.english_name,
        arabic_name: req.body.arabic_name
          ? req.body.arabic_name
          : admin.arabic_name,
        password: req.body.password
          ? await hash(req.body.password)
          : admin.password,
        english_description: req.body.english_description
          ? req.body.english_description
          : admin.english_description,
        arabic_description: req.body.arabic_description
          ? req.body.arabic_description
          : admin.arabic_description,
        english_bio: req.body.english_bio
          ? req.body.english_bio
          : admin.english_bio,
        arabic_bio: req.body.arabic_bio
          ? req.body.arabic_bio
          : admin.arabic_bio,
        whatsapp: req.body.whatsapp ? req.body.whatsapp : admin.whatsapp,
        telegram: req.body.telegram ? req.body.telegram : admin.telegram,
        facebook: req.body.facebook ? req.body.facebook : admin.facebook,
        instgram: req.body.instgram ? req.body.instgram : admin.instgram,
        linkedIn: req.body.linkedIn ? req.body.linkedIn : admin.linkedIn,
        behance: req.body.behance ? req.body.behance : admin.behance,
        email_address: req.body.email_address
          ? req.body.email_address
          : admin.email_address,
        phone: req.body.phone ? req.body.phone : admin.phone,
      },
      { new: true }
    );

    // create response
    const response = {
      data: _.pick(new_admin, [
        "_id",
        "english_name",
        "english_description",
        "english_bio",
        "arabic_name",
        "arabic_description",
        "arabic_bio",
        "phon",
        "whatsapp",
        "telegram",
        "facebook",
        "instgram",
        "linkedIn",
        "behance",
        "email_address",
      ]),
      messages: {
        english: "Info updated successfully",
        arabic: "تم تعديل البيانات بنجاح",
      },
    };

    // send the response to clinte
    res.status(200).send(response);
  } catch (error) {
    // delete it
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
