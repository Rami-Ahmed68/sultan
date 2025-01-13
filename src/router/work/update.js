const express = require("express");
const router = express.Router();

// import validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the user (admin) model
const User = require("../../model/user/user");

// import the work model
const Work = require("../../model/work/work");

// import validate n=body dat method
const validation_data = require("../../controller/middleware/joi_validation/work/update");

// import upload images to cloudinary method
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import upload video to cloudinary method
const upload_cloudinary_video = require("../../controller/middleware/cloudinary/upload.cloudinary.video");

// import upload the files method
const upload_files = require("../../controller/utils/multer/work/upload.work.files");

// import the delete image fro cloudinary method
const delete_cloudinary_images = require("../../controller/middleware/cloudinary/delete.cloudinary.image.js");

// import the delete video fro cloudinary method
const delete_cloudinary_video = require("../../controller/middleware/cloudinary/delete.cloudinary.video.js");

// import the delete uploaded files
const DeleteImage = require("../../controller/utils/multer/delete.files");

// import verify token data
const verify_token = require("../../controller/utils/token/verify_token");

router.put("/", upload_files, async (req, res, next) => {
  try {
    // validate body data
    const Error = validation_data(req.body);

    // check if the body data has any error
    if (Error.error) {
      // check if the request has any file
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          DeleteImage(req.files[i], next);
        }
      }

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

    // check if the request has a new data
    if (
      !req.body.english_title &&
      !req.body.english_description &&
      !req.body.arabic_title &&
      !req.body.arabic_description &&
      !req.body.link &&
      !req.body.created_at &&
      !req.body.tags &&
      !req.body.images_for_delete &&
      !req.body.video_reaction &&
      !req.files
    ) {
      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, you should send a new data ...",
            arabic: "... عذرا يجب ارسال بيانات جديدة",
          }),
          403
        )
      );
    }

    // filter all images of files in request
    let images = await req.files.filter((file) => {
      return file.mimetype.startsWith("image");
    });

    // filter all vidoes of files in request
    let videos = await req.files.filter((file) => {
      return file.mimetype.startsWith("video");
    });

    // check if the videos length is more than 1
    if (videos.length > 1) {
      // dlete all uploaded files
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }

      // return the error
      return next(
        new ApiErrors(
          JONS.stringify({
            english: "Sorry, you can't upload more than one video ...",
            arabic: "... عذرا لا يمكنك تحميل اكثر من فيديو واحد",
          }),
          403
        )
      );
    }

    // verify the token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's id in token is equal id in body
    if (req.body.admin_id != verify_token_data._id) {
      // dlete all uploaded files
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }

      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin data ...",
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
      // dlete all uploaded files
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }

      // return the error
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

    // find the work
    const work = await Work.findById(req.body.work_id);

    // check if the work is exists
    if (!work) {
      // dlete all uploaded files
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }

      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid work not found ...",
            arabic: "... عذرا لم يتم العثور على العمل",
          }),
          404
        )
      );
    }

    // find and update the work
    const updated_work = await Work.findByIdAndUpdate(
      { _id: req.body.work_id },
      {
        $set: {
          english_title: req.body.english_title
            ? req.body.english_title
            : work.english_title,
          english_description: req.body.english_description
            ? req.body.english_description
            : work.english_description,
          arabic_title: req.body.arabic_title
            ? req.body.arabic_title
            : work.arabic_title,
          arabic_description: req.body.arabic_description
            ? req.body.arabic_description
            : work.arabic_description,
          link: req.body.link ? req.body.link : work.link,
          tags: req.body.tags ? req.body.tags.split(".") : work.tags,
          created_at: req.body.created_at
            ? req.body.created_at
            : work.created_at,
        },
      },
      { new: true }
    );

    // svae the updated work to check id the tags has any error
    await updated_work.save();

    // check if the work already has a video
    if (
      (work.video && work.video != "" && videos.length == 1) ||
      (work.video != "" &&
        req.body.video_reaction &&
        req.body.video_reaction == "delete")
    ) {
      // delete the old video
      await delete_cloudinary_video(work.video, next);

      // set a empty video url to updated_work
      updated_work.video = "";
    }

    // check if the request has a images for delete
    if (req.body.images_for_delete) {
      let coverted_images_for_delete = JSON.parse(req.body.images_for_delete);

      // delete the images
      for (let i = 0; i < coverted_images_for_delete.length; i++) {
        await delete_cloudinary_images(coverted_images_for_delete[i], next);

        // filter the work's images array
        work.images = work.images.filter((url) => {
          return url != coverted_images_for_delete[i];
        });
      }
    }

    // check if the request has a video file
    if (
      (videos.length == 1 && !req.body.video_reaction) ||
      (req.body.video_reaction && req.body.video_reaction != "delete")
    ) {
      // upload the new video
      const new_video = await upload_cloudinary_video(videos[0], "work", next);

      // set the new video utl to work's video
      updated_work.video = new_video;
    }

    // check if the request has any images file
    if (images.length > 0) {
      // upload the images
      for (let i = 0; i < images.length; i++) {
        let uploaded_image_url = await upload_cloudinary_image(
          images[i],
          "work",
          next
        );

        work.images.push(uploaded_image_url);
      }
    }

    // set the images array to the updated work
    updated_work.images = work.images;

    // check if the requets has any file
    if (req.files && req.files.length > 0) {
      // delete all uploaded files from work
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }
    }

    // svae the update work
    await updated_work.save();

    // create response
    const response = {
      message: {
        english: "Work updated successfully",
        arabic: "تم تعديل العمل بنجاح",
      },
      work_data: updated_work,
    };

    // send the response to clint
    res.status(200).send(response);
  } catch (error) {
    // check if the body has an file
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }
    }

    //return the error
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
