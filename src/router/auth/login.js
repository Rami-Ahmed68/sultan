const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const _ = require("lodash");

// import the user model
const User = require("../../model/user/user");

// compare password
const compare = require("../../controller/utils/password/compaer");

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
