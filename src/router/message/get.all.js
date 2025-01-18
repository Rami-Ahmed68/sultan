const express = require("express");
const router = express.Router();

// import message model
const Message = require("../../model/message/message");

router.get("/", async (req, res, next) => {
  try {
    // get teh messages
    const messages = await Message.find();

    // create the response
    const response = {
      message: {
        english: "Messages geted successfully",
        arabic: "... تم جلب الرسائل بنجاح",
      },
      messages_data: messages,
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
