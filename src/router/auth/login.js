const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import the user model
const User = require("../../model/user/user");

// compare password
const compare = require("../../controller/utils/password/compaer");

// generate_token
const generate_token = require("../../controller/utils/token/generate_token");

// validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import validate login data
const validation_error = require("../../controller/middleware/joi_validation/auth/login");

router.post("/", async (req, res, next) => {
  try {
    // validate the body data
    const Error = validation_error(req.body);

    // check if the body data has any error
    if (Error.error) {
      return next(
        new ApiErrors(
          JSON.stringify({
            english: Error.error.details[0].message,
            arabic: "... عذرا خطأ في البيانات",
          }),
          400
        )
      );
    }

    // get to the admin by id
    const admin = await User.findOne({ email: req.body.email });
    console.log(admin.password);
    console.log(req.body.password);

    // check if the admin is exists
    if (!admin) {
      return next(
        new ApiErrors(
          JSON.stringify({
            english: `Sorry, invalid email or password ...`,
            arabic: `... عذرا خطأ في الايميل او الباسورد`,
          }),
          404
        )
      );
    }

    // compare password and check if its seems
    const compaer_password = await compare(req.body.password, admin.password);
    console.log(compaer_password);
    if (compaer_password == false) {
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid email or password ...",
            arabic: "... عذرا خطأ في الايميل او الباسورد",
          }),
          404
        )
      );
    }

    //generate new token
    const token = generate_token(admin._id, admin.email);

    // create the response
    const response = {
      message: {
        english: `Loged in successfully, welcome ${this.admin_data.name}`,
        arabic: ` ${this.admin_data.name} تم تسجيل الدخول بنجاح, اهلا`,
      },
      admin_data: _.pick(admin, [
        "_id",
        "name",
        "email",
        "avatar",
        "description",
        "bio",
        "whatsapp",
        "phone",
        "links",
        "cv",
      ]),
      token: token,
    };

    // send the response to clinet
    res.status(200).send(response);
  } catch (error) {
    // return error
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
