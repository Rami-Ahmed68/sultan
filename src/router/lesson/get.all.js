const express = require("express");
const router = express.Router();

// import validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the lesson model
const Lesson = require("../../model/lesson/lesson");

router.get("/", async (req, res, next) => {
  try {
    // covert the tags array
    let tags_array = req.query.tags ? JSON.parse(req.query.tags) : [];

    // create the program type var
    let program_type = req.query.program;

    // createthe level var
    let level = req.query.level;

    // create the page var
    const page = req.query.page || 1;

    // create the limit var
    const limit = req.query.limit || 5;

    // create the skip of document var
    const skip = (page - 1) * limit;

    // create the lessonse var
    let lessons;

    // check if the requets has tags or program's type or level
    if (req.query.tags || req.query.program || req.query.level) {
      // get the lessons
      lessons = await Lesson.find({
        $or: [
          { tags: { $in: tags_array } },
          { program: program_type },
          { level: { $in: level } },
        ],
      })
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
    } else {
      // get the lessons
      lessons = await Lesson.find().skip(skip).limit(limit).sort({ _id: -1 });
    }

    // create the response
    const response = {
      message: {
        english: "Lessons geted successfully",
        arabic: "تم جلب الدروس بنجاح",
      },
      lessons_data: lessons,
    };

    // send the response to clint
    res.status(200).send(response);
  } catch (error) {
    // return error
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
