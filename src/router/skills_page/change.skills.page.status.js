const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import the error handling method
const ApiErrors = require("../../controller/utils/validation_error");

// import user model
const User = require("../../model/user/user");

// importing the verify token method
const verify_token = require("../../controller/utils/token/verify_token");

// import the validation error method
const validate_data = require("../../controller/middleware/joi_validation/skills_page_status/update");

router.put("/", async (req, res, next) => {
  try {
    // validate the body
    const Error = validate_data(req.body);

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

    // verify token
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's id in body is equal id n token
    if (req.body.admin_id != verify_token_data._id) {
      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin data ...",
            arabic: "... عذار خطأ في بيانات الأدمن",
          }),
          400
        )
      );
    }

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

    // update the skills_page_status in admin
    admin.skills_page_status = req.body.skills_page_status;

    // save the admin after changed
    await admin.save();

    // create response
    const response = {
      skills_page_status: admin.skills_page_status,
    };

    // send the response to clinte
    res.status(200).send(response);
  } catch (error) {
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
