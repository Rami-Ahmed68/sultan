const express = require("express");
const router = express.Router();

// import the user model
const User = require("../../model/user/user");

// import the lesson model
const Lesson = require("../../model/lesson/lesson");

// import the validation error method
const ApiErrors = require("../../controller/utils/validation_error");

// import validation body data method
const validation_data = require("../../controller/middleware/joi_validation/lesson/delete");

// verify token method
const verify_token = require("../../controller/utils/token/verify_token");

// import the delete files from cloudinary cloud
const delete_cloudinary = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import the delete video method from cloudinary
const delete_cloudinary_video = require("../../controller/middleware/cloudinary/delete.cloudinary.video");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validation_data(req.body);

    // check if the body data has any error
    if (Error.error) {
      // return the error
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

    // verify token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin in body is equal the admin is in token
    if (req.body.admin_id != verify_token_data._id) {
      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin data ...",
            arabic: "... عذرا خطأ في بيانات الادمن المرسلة",
          })
        ),
        400
      );
    }

    // find the admin by his id
    const admin = await User.findById(req.body.admin_id);

    // check if the admin is not exists
    if (!admin) {
      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin not found ...",
            arabic: "... عذرا لم يتم العثور على حساب الأدمن",
          })
        ),
        404
      );
    }

    // find the lesson
    const lesson = await Lesson.findById(req.body.lesson_id);

    // check if the lesson is eixsts or not
    if (!lesson) {
      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid lesson not found ...",
            arabic: "... عذرا لم يتم العثور على الدرس",
          })
        ),
        404
      );
    }

    // create a new images array for delete
    let images_for_delete = lesson.images;

    // check if the lesson has a video cover
    if (lesson.video_cover != "") {
      // adding the vidoe cover url to images_for_delete array
      images_for_delete.push(lesson.video_cover);
    }

    // delete all lesson's images
    for (let i = 0; i < images_for_delete.length; i++) {
      await delete_cloudinary(images_for_delete[i], next);
    }

    // check if the lesson has a video
    if (lesson && lesson.video != "") {
      // delete the lesson's video
      await delete_cloudinary_video(lesson.video, next);
    }

    // delete the finded lesson
    await lesson.deleteOne(lesson._id);

    // create the response
    const response = {
      message: {
        english: "lesson deleted the successfully ...",
        arabic: "... تم حذف الدرس بنجاح",
      },
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
