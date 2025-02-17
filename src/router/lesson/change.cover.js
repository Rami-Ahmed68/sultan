const express = require("express");
const router = express.Router();

// import the validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the lesson model
const Lesson = require("../../model/lesson/lesson");

// import the User (admin) model
const User = require("../../model/user/user");

// import the upload video cover method
const upload_lesson_cover = require("../../controller/utils/multer/lesson/upload.lesson.cover");

// importthe dlete image method
const DeleteImage = require("../../controller/utils/multer/delete.files");

// import the upload cloudinary method
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import the delete cloudinary method
const delete_cloudinary = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import the validate body data method
const validation_error = require("../../controller/middleware/joi_validation/lesson/change.cover");

// import the verify token method
const verify_token = require("../../controller/utils/token/verify_token");

router.put("/", upload_lesson_cover, async (req, res, next) => {
  try {
    // check if the request has a cover or not
    if (req.files && req.files.length > 1) {
      for (let i = 0; i < req.files.length; i++) {
        // delete the uploaded covers
        DeleteImage(req.files[i], next);
      }

      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english:
              "Sorry, you can't upload more than one image as (cover) ...",
            arabic: "... عذرا لا يمكنك رفع اكثر من صورة (غلاف)",
          }),
          400
        )
      );
    }

    // validate the body data
    const Error = validation_error(req.body);

    // check if the body has any error
    if (Error.error) {
      // delete the uploaded image (cover)
      DeleteImage(req.files[0], next);

      // return error
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

    // verify the token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin id in body is equest the admin id in token
    if (req.body.admin_id != verify_token_data._id) {
      // delete the uploaded cover
      DeleteImage(req.files[0], next);

      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin data ...",
            arabic: "... عذرا خطأ في بيانات المستخدم",
          }),
          400
        )
      );
    }

    // find the admin by his id
    const admin = await User.findById(req.body.admin_id);

    // check if the admin is exists or not
    if (!admin) {
      // delete the uploaded cover
      DeleteImage(req.files[0], next);

      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin not found ...",
            arabic: "... عذرا لم يتم العثور على حساب الأدمن",
          }),
          404
        )
      );
    }

    // find the lesson
    const lesson = await Lesson.findById(req.body.lesson_id);

    // check if the body is exists or not
    if (!lesson) {
      // delete the uploaded cover
      DeleteImage(req.files[0], next);

      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid lesson nodt found ...",
            arabic: "... عذرا لم يتم العثور على العمل ",
          }),
          404
        )
      );
    }

    // check if the lesson alerady has a cover and delete it
    if (lesson.video_cover && lesson.video_cover != "") {
      // delete the old cover
      await delete_cloudinary(lesson.video_cover, next);
    }

    // upload the new cover to cloudinary
    const uploaded_cover = await upload_cloudinary_image(
      req.files[0],
      "lesson",
      next
    );

    // find the lesson andupdate the video_cover
    const updated_lesson = await Lesson.findByIdAndUpdate(
      { _id: req.body.lesson_id },
      {
        $set: {
          video_cover: uploaded_cover,
        },
      },
      { new: true }
    );

    // delete the uploaded cover from lesson folder
    DeleteImage(req.files[0], next);

    // save the lesson after changed the cover
    await lesson.save();

    // create response
    const response = {
      message: {
        english: "Cover changed successfully ...",
        arabic: "تم تعديل الغلاف بنجاح",
      },
      lesson_data: updated_lesson,
    };

    // send the response
    res.status(200).send(response);
  } catch (error) {
    // check if the request has any file
    if (req.files) {
      // delete the uploaded image
      DeleteImage(req.files[0], next);
    }

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
