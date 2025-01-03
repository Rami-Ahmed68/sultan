const express = require("express");
const router = express.Router();

// import validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the validate lesson model
const Lesson = require("../../model/lesson/lesson");

router.get("/", async (req, res, next) => {
  try {
    // check if the quesry has an lesson id
    if (!req.query.lesson_id) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, you should send a lesson id ...",
            arabic: "... عذرا يجب ارسال معرف الدرس",
          }),
          404
        )
      );
    }

    // get the lesson by his id
    const lesson = await Lesson.findById(req.query.lesson_id);

    // check if the body is exists or not
    if (!lesson) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid lesson not found ...",
            arabic: "... عذرا لم يتم العثور على الدرس",
          }),
          404
        )
      );
    }

    // create the response
    const response = {
      message: {
        english: "Lesson geted successfully",
        arabic: "تم العثور على الدرس بنجاح",
      },
      lesson_data: lesson,
    };

    // send the response to clint
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
