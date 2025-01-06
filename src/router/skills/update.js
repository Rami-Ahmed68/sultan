const express = require("express");
const router = express.Router();

// import thevalidate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the user (admin) model
const User = require("../../model/user/user");

// import the skill model
const Skill = require("../../model/skills/skills");

// import the validate body data method
const validate_data = require("../../controller/middleware/joi_validation/skill/update");

// import verify token data method
const verify_token = require("../../controller/utils/token/verify_token");

router.put("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_data(req.body);

    // check if the body has any error
    if (Error.error) {
      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: `${Error.error.details[0].message} ...`,
            arabic: "... عذرا خطأ عام",
          }),
          400
        )
      );
    }

    // check if the body has any data or not
    if (!req.body.title && !req.body.description && !req.body.created_at) {
      // return the error
      return next(
        new ApiErrors(
          JSON.stringify({
            english:
              "Sorry, you should send a new data to update the skill ...",
            arabic: "... عذرا يجب عليك ارسال بيانات جديدة لتعديل المهارة",
          }),
          403
        )
      );
    }

    // verifythe token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // checkif the admin's id in token is equal admin id in body
    if (verify_token_data._id != req.body.admin_id) {
      // return error
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

    // check if the admin is exists or not
    if (!admin) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid admin not found ...",
            arabic: "... ذعرا لم يتم العثور على الأدمن",
          }),
          404
        )
      );
    }

    // find the skill by id
    const skill = await Skill.findById(req.body.skill_id);

    // check if the skill is eixsts or not
    if (!skill) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, invalid skill not found ...",
            arabic: "...عذرا لم يتم العثور على المهارة",
          }),
          404
        )
      );
    }

    // find and update the skill
    const updated_skill = await Skill.findByIdAndUpdate(
      { _id: req.body.skill_id },
      {
        $set: {
          english_title: req.body.english_title
            ? req.body.english_title
            : skill.english_title,
          arabic_title: req.body.arabic_title
            ? req.body.arabic_title
            : skill.arabic_title,
          english_description: req.body.english_description
            ? req.body.english_description
            : skill.english_description,
          arabic_description: req.body.arabic_description
            ? req.body.arabic_description
            : skill.arabic_description,
          created_at: req.body.created_at
            ? req.body.created_at
            : skill.created_at,
        },
      },
      { new: true }
    );

    // save the updated skill (changes) in data base
    await updated_skill.save();

    // create a response
    const response = {
      message: {
        english: "Skill updated successfully ...",
        arabic: "... تم تعديل المهارة بنجاح",
      },
      skill_data: updated_skill,
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
