const express = require("express");
const router = express.Router();

// import handling error method
const ApiErrors = require("../../controller/utils/validation_error");

// import work model
const Work = require("../../model/work/work");

// import User model
const User = require("../../model/user/user");

// import delete image method
const DeleteImage = require("../../controller/utils/multer/delete.files");

// import validation error method
const validation_data = require("../../controller/middleware/joi_validation/work/create");

// verify token method
const verify_token = require("../../controller/utils/token/verify_token");

// import uploading single video method
const upload_files = require("../../controller/utils/multer/work/upload.work.files");

// import upload images to cloudinary method
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import upload videos to cloudinary method
const upload_video_cloudinary = require("../../controller/middleware/cloudinary/upload.cloudinary.video");

router.post("/", upload_files, async (req, res, next) => {
  try {
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
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // find the admin by his id in token
    const admin = await User.findById(verify_token_data._id);

    // check if the admin is exists or not
    if (!admin) {
      // check if the request has any image
      if (req.files.length > 0) {
        // delete the images
        for (leti = 0; i < req.files.length; i++) {
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

    // create the new work's Object
    const work = new Work({
      english_title: req.body.english_title,
      arabic_title: req.body.arabic_title,
      english_description: req.body.english_description,
      arabic_description: req.body.arabic_description,
      link: req.body.link ? req.body.link : "",
      video: "",
      images: [],
      created_at: req.body.created_at,
      tags: req.body.tags.split("."),
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
        "work",
        next
      );

      // set the uploaded video to the created work
      work.video = uploaded_video;
    }

    // check if the request has any image
    if (images.length > 0) {
      // upload the image file to cloudinary
      for (let i = 0; i < images.length; i++) {
        let uploaded_image = await upload_cloudinary_image(
          images[i],
          "work",
          next
        );

        // add the uploaded image url into the new work's images
        work.images.push(uploaded_image);
      }
    }

    // save the work in data base
    await work.save();

    // delete all file from work folder
    for (let i = 0; i < req.files.length; i++) {
      DeleteImage(req.files[i], next);
    }

    // create response
    const response = {
      message: {
        english: "Work Created Successfully",
        arabic: "تم انشاء العمل بنجاح",
      },
      work_data: work,
    };

    // send the response to clint
    res.status(200).send(response);
  } catch (error) {
    // check if the request has any image
    if (req.files.length > 0) {
      // delete the images
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }
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
