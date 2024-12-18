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
const generate_token = require("../../controller/utils/token/generae_token");

// import uploading avatar
const upload_avatar = require("../../controller/utils/multer/avatar/upload.avatar");

// import the delete images method
const DeleteImage = require("../../controller/utils/multer/delete.image");

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
            english: Error.error.details[0].message,
          }),
          400
        )
      );
    }

    // create new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwoed: await hash(req.body.passwoed),
      description: req.body.description,
      bio: req.body.bio,
      whatsapp: req.body.whatsapp,
      phone: req.body.phone,
      links: req.body.links,
    });

    // save the user in data base
    await user.save();

    // create the response
    const response = {
      user_data: _.pick(user, [
        "_id",
        "name",
        "cover",
        "email",
        "password",
        "description",
        "bio",
        "whatsapp",
        "phone",
        "links",
      ]),
      // generate token
      token: generate_token(user._id, user.email),
    };

    // send the response
    res.status(200).send(response);
  } catch (error) {
    // delete the image
    DeleteImage(req.file, next);

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
