const express = require("express");
const router = express.Router();

// import message model
const Message = require("../../model/message/message");

router.get("/", async (req, res, next) => {
  try {
    // get teh messages's count
    const messages_count = await Message.countDocuments({});

    // create the response
    const response = {
      message: {
        english: "Messages's count geted successfully",
        arabic: "... تم جلب عدد الرسائل بنجاح",
      },
      messages_count: messages_count,
    };

    // send teh response to clinte
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
