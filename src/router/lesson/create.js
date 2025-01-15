const express = require("express");
const router = express.Router();

// import handling error method
const ApiErrors = require("../../controller/utils/validation_error");

// import lesson model
const Lesson = require("../../model/lesson/lesson");

// import User model
const User = require("../../model/user/user");

// import delete image method
const DeleteImage = require("../../controller/utils/multer/delete.files");

// import validation error method
const validation_data = require("../../controller/middleware/joi_validation/lesson/create");

// verify token method
const verify_token = require("../../controller/utils/token/verify_token");

// import uploading single video method
const upload_files = require("../../controller/utils/multer/lesson/upload.lesson.files");

// import upload images to cloudinary method
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import upload videos to cloudinary method
const upload_video_cloudinary = require("../../controller/middleware/cloudinary/upload.cloudinary.video");

router.post("/", upload_files, async (req, res, next) => {
  // try {
  // validation body data
  const Error = validation_data(req.body);

  // check if the body data has any error
  if (Error.error) {
    // check if the request has any image
    if (req.files.length > 0) {
      // delete the images
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }
    }

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

  // verify token data
  const verify_token_data = await verify_token(req.headers.authorization, next);

  // find the admin by his id in token
  const admin = await User.findById(verify_token_data._id);

  // check if the admin is exixsts or not
  if (!admin) {
    // check if the request has any image
    if (req.files.length > 0) {
      // delete the images
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }
    }

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

  // create the new lesson's Object
  const lesson = new Lesson({
    english_title: req.body.english_title,
    english_description: req.body.english_description,
    arabic_title: req.body.arabic_title,
    arabic_description: req.body.arabic_description,
    link: req.body.link ? req.body.link : "",
    video: "",
    images: [],
    created_at: req.body.created_at,
    tags: req.body.tags.split("."),
    program: req.body.program,
    level: req.body.level,
  });

  // filter the videos file
  let videos = await req.files.filter((file) => {
    return file.mimetype.startsWith("video");
  });

  // filter the images file
  let images = await req.files.filter((file) => {
    return file.mimetype.startsWith("image");
  });

  // check if the request has any video
  if (videos.length > 0) {
    // upload the video file to cloudinary
    let uploaded_video = await upload_video_cloudinary(
      videos[0],
      "lesson",
      next
    );

    // set the uploaded video to the created lesson
    lesson.video = uploaded_video;
  }

  // check if the request has any image
  if (images.length > 0) {
    // upload the image file to cloudinary
    for (let i = 0; i < images.length; i++) {
      let uploaded_image = await upload_cloudinary_image(
        images[i],
        "lesson",
        next
      );

      // add the uploaded image url into the new lesson's images
      lesson.images.push(uploaded_image);
    }
  }

  // save the lesson in data base
  await lesson.save();

  // delete all file from lesson folder
  for (let i = 0; i < req.files.length; i++) {
    DeleteImage(req.files[i], next);
  }

  // create response
  const response = {
    message: {
      english: "Lesson created successfully",
      arabic: "تم انشاء الدرس بنجاح",
    },
    lesson_data: lesson,
  };

  // send the response to clint
  res.status(200).send(response);
  // } catch (error) {
  //   // check if the request has any image
  //   if (req.files.length > 0) {
  //     // delete the images
  //     for (let i = 0; i < req.files.length; i++) {
  //       DeleteImage(req.files[i], next);
  //     }
  //   }

  //   // return the error
  //   return next(
  //     new ApiErrors(
  //       JSON.stringify({
  //         english: `${error} ...`,
  //         arabic: "... عذرا خطأ عام",
  //       }),
  //       500
  //     )
  //   );
  // }
});

module.exports = router;
