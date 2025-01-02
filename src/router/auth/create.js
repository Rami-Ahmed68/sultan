const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import the error handling method
const ApiErrors = require("../../controller/utils/validation_error");

// import user model
const User = require("../../model/user/user");

// import validation data method
const validation_error = require("../../controller/middleware/joi_validation/auth/create");

// import generate_token token method
const generate_token = require("../../controller/utils/token/generate_token");

// import uploading avatar
const upload_avatar = require("../../controller/utils/multer/avatar/upload.avatar");

// import the delete images method
const DeleteImage = require("../../controller/utils/multer/delete.files");

// import hash method
const hash = require("../../controller/utils/password/hash");

router.post("/", upload_avatar, async (req, res, next) => {
  try {
    // validate body data
    const Error = validation_error(req.body);

    // check if the body data has error
    if (Error.error) {
      return next(
        new ApiErrors(
          JSON.stringify({
            english: `${Error.error.details[0].message} ...`,
            arabic: "... عذرا خطأ في البيانات المرسلة",
          }),
          400
        )
      );
    }

    // hashed password
    const hashedPassword = await hash(req.body.password);

    // create new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      description: req.body.description ? req.body.description : "",
      bio: req.body.bio ? req.body.bio : "",
      whatsapp: req.body.whatsapp ? req.body.whatsapp : "",
      phone: req.body.phone ? req.body.phone : "",
      links: req.body.links ? req.body.links : "",
    });

    // save the user in data base
    await user.save();

    // check if the req has more than 1 file
    if (req.files) {
      // delete the image
      DeleteImage(req.file, next);
    }

    // delete the avatar from avatar folder
    // DeleteImage(req.files, next);

    // create the response
    const response = {
      user_data: _.pick(user, [
        "_id",
        "name",
        "cover",
        "email",
        "description",
        "bio",
        "whatsapp",
        "phone",
        "links",
        "cv",
      ]),
      // generate token
      token: generate_token(user._id, user.email),
    };

    // send the response
    res.status(200).send(response);
  } catch (error) {
    // check if the req has more than 1 file
    if (req.files) {
      // delete the image
      DeleteImage(req.file, next);
    }

    // return error
    return next(
      new ApiErrors(
        JSON.stringify({
          englihs: `${error} ...`,
          arabic: "... عذرا خطأ عام",
        }),
        500
      )
    );
  }
});

module.exports = router;
