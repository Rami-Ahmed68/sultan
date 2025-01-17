const express = require("express");
const router = express.Router();

// import validate error
const ApiErrors = require("../../controller/utils/validation_error");

// import message model
const Message = require("../../model/message/message");

// import validate body data method
const validate_data = require("../../controller/middleware/joi_validation/message/create");

router.post("/", async (req, res, next) => {
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

    // check if the requets hasa email or a phone number or whatsapp
    if (!req.body.email && !req.body.phone_number && !req.body.whatsapp) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: `Sorry, you should send a email's address or phone's number or whatsapp's number ...`,
            arabic:
              "... عذرا يجب عليك إرسال عنوان البريد الإلكتروني او رقم الهاتف او رقم الواتس آب",
          })
        ),
        403
      );
    }

    // create a new message
    const message = new Message({
      name: req.body.message,
      email: req.body.emauil ? req.body.email : "",
      phone_number: req.body.phone_number ? req.body.phone_number : "",
      whatsapp: req.body.whatsapp ? req.body.whatsapp : "",
      message: req.body.message,
    });

    // save the new message in data base
    await message.save();

    // craete response
    const response = {
      message: {
        english: "Created Successfully",
        arabic: "تم الإنشاء بنجاح",
      },
    };

    // send the response to clinte
    res.status(200).send(response);
  } catch (error) {
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
