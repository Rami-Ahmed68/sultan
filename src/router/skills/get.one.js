const express = require("express");
const router = express.Router();

// import validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the validate skill model
const Skill = require("../../model/skills/skills");

router.get("/", async (req, res, next) => {
  try {
    // check if the quesry has an skill id
    if (!req.query.skill_id) {
      // return error
      return next(
        new ApiErrors(
          JSON.stringify({
            english: "Sorry, you should send a skill id ...",
            arabic: "... عذرا يجب ارسال معرف المهارة",
          }),
          404
        )
      );
    }

    // get the skill by his id
    const skill = await Skill.findById(req.query.skill_id);

    // check if the body is exists or not
    if (!skill) {
      // return error
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

    // create the response
    const response = {
      message: {
        english: "skill geted successfully",
        arabic: "تم العثور على المهارة بنجاح",
      },
      skill_data: skill,
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
