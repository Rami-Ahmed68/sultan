const express = require("express");
const router = express.Router();

// valiadte error method
const ApiErrors = require("../../controller/utils/validation_error");

// import message's model
const Message = require("../../model/message/message");

// import user (admin) model
const User = require("../../model/user/user");

// validate body data method
const validate_data = require("../../controller/middleware/joi_validation/message/delete");

// import verify token method
const verify_token = require("../../controller/utils/token/verify_token");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_data(req.body);

    // check if the body data has any error
    if (Error.error) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: `${Error.error.details[0].message} ...`,
            arabic: "... عذرا خطأ في البيانات المرسلة",
          })
        ),
        400
      );
    }

    // verify the token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's id in token is equal id in body
    if (verify_token_data._id != req.body.admin_id) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin's data ...",
            arabic: "... عذرا خطأ في بيانات الأدمن",
          }),
          400
        )
      );
    }

    // find the admin
    const admin = await User.findById(req.body.admin_id);

    // check if the admin is exists
    if (!admin) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin not found ...",
            arabic: "... عذرا لم يتم العثور على الأدمن",
          }),
          404
        )
      );
    }

    // find the message
    const message = await Message.findById(req.body.message_id);

    // check if the message is exists
    if (!message) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid message not found ...",
            arabic: "... عذرا لم يتم العثور على الرسالة",
          }),
          404
        )
      );
    }

    // delete teh message
    await Message.deleteOne(message._id);

    // craete response
    const response = {
      message: {
        english: "Message deleted successfully",
        arabic: "... تم حذف الرسالة بنجاح",
      },
    };

    // send the response to clinte
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
