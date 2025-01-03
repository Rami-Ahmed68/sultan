const express = require("express");
const router = express.Router();

// import the validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the user (admin) model
const User = require("../../model/user/user");

// import the skill model
const Skill = require("../../model/skills/skills");

// import the validate body data method
const validate_data = require("../../controller/middleware/joi_validation/skill/change.icon");

// import the upload image to cloudinary
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import the delete image from cloudinary
const delete_cloudinary_images = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import the upload icon using (multer)
const upload_icon = require("../../controller/utils/multer/skill/upload.skill");

// import the verify token data method
const verify_toen = require("../../controller/utils/token/verify_token");

// import the delete uploaded files (image) from folder
const DeleteImage = require("../../controller/utils/multer/delete.files");

router.put("/", upload_icon, async (req, res, next) => {
  try {
    // validate the bdoy data
    const Error = validate_data(req.body);

    // chdck if the body has any error
    if (Error.error) {
      // delete the uploaded image (icon)
      DeleteImage(req.files[0], next);

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

    // check if the request has more than one icon
    if (req.files && req.files.length > 1) {
      // delete the uploaded images
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }

      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, you can't upload more than one icon ...",
            arabic: "... عذرا لا يمكنك تحميل اكثر من ايقونة واحدة",
          }),
          403
        )
      );
    }

    // check if the body has any icon or not
    if (!req.files || req.files.length == 0) {
      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, you must upload at least one icon ...",
            arabic: "... عذرا يجب عليك رفع ايقونة واحدة على الأقل",
          }),
          403
        )
      );
    }

    // verif the token data
    const verify_token_data = await verify_toen(
      req.headers.authorization,
      next
    );

    // check if the admin's id in token equal admin's id in body
    if (verify_token_data._id != req.body.admin_id) {
      // delete the uploaded image(icon)
      DeleteImage(req.files[0], next);

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

    // find the admin by his id
    const admin = await User.findById(req.body.admin_id);

    // check if the adminis exists or not
    if (!admin) {
      // delete the uploaded image (icon)
      DeleteImage(req.files[0], next);

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

    // find the skill by id
    const skill = await Skill.findById(req.body.skill_id);

    // check if the skill is exists
    if (!skill) {
      // delete the uploaded image (icon)
      DeleteImage(req.files[0], next);

      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid skill not found ...",
            arabic: "... عذرا لم يتم العثور على المهارة",
          }),
          404
        )
      );
    }

    // delete the old icon from cloudinary
    await delete_cloudinary_images(skill.icon, next);

    // uploade the new icon
    const new_icon = await upload_cloudinary_image(req.files[0], "skill", next);

    // set the new icon to skill
    skill.icon = new_icon;

    // save the skill in data base after updated
    await skill.save();

    // delete the uploaded image (icon) from folder
    DeleteImage(req.files[0], next);

    // create response
    const response = {
      message: {
        english: "Icon changed successfully ...",
        arabic: "... تم تعديل الايقونة بنجاح",
      },
      skill_data: skill,
    };

    // send the response to clinte
    res.status(200).send(response);
  } catch (error) {
    // delete the uploaded image
    DeleteImage(req.files[0], next);

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
