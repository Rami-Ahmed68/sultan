const express = require("express");
const router = express.Router();

// import validate body data method
const ApiErrors = require("../../controller/utils/validation_error");

// import validate body data method
const validation_data = require("../../controller/middleware/joi_validation/skill/delete");

// import the user (admin) model
const User = require("../../model/user/user");

// import the skill model
const Skill = require("../../model/skills/skills");

// import the delete image fro cloudinary method
const delete_cloudinary_images = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import verify token data method
const verify_toen = require("../../controller/utils/token/verify_token");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validation_data(req.body);

    // check if the body has any error
    if (Error.error) {
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

    // verify  token data
    const verify_toen_data = await verify_toen(req.headers.authorization, next);

    // check if the admin id in token is equal id in body
    if (verify_toen_data._id != req.body.admin_id) {
      // retuen error
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

    // check if the admin is exists
    if (!admin) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin not found ...",
            arabic: "... عذار لم يتم العثور على الأدمن",
          }),
          404
        )
      );
    }

    // find the skill by id
    const skill = await Skill.findById(req.body.skill_id);

    // check if the skill is exists or not
    if (!skill) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid skill not found ...",
            arabic: "... عذار لم يتم العثور على المهارة",
          }),
          404
        )
      );
    }

    // delete the skill icon from cloudinary
    await delete_cloudinary_images(skill.icon, next);

    // delete the skill
    await Skill.deleteOne(skill._id);

    // create response
    const response = {
      message: {
        english: "Skill deleted successfully ...",
        arabic: "... تم حذف المهارة بنجاح",
      },
    };

    // send the response to clint
    res.status(200).send(response);
  } catch (error) {
    // return the error
    return next(
      new ApiErrors(
        JSON.stringify({
          english: `${error} ...`,
          arabic: "...ذعرا خطأ عام",
        }),
        500
      )
    );
  }
});

module.exports = router;
