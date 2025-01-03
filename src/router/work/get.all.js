const express = require("express");
const router = express.Router();

// import validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the work model
const Work = require("../../model/work/work");

router.get("/", async (req, res, next) => {
  try {
    // covert the tags array
    let tags_array = req.query.tags ? JSON.parse(req.query.tags) : [];

    // create the page var
    const page = req.query.page || 1;

    // create the limit var
    const limit = req.query.limit || 5;

    // create the skip of document var
    const skip = (page - 1) * limit;

    // create works var
    let works;

    // check if the requets has any tag
    if (req.query.tags) {
      // get the works
      works = await Work.find({
        tags: {
          $in: tags_array,
        },
      })
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
    } else {
      // get the works
      works = await Work.find().skip(skip).limit(limit).sort({ _id: -1 });
    }

    // create the response
    const response = {
      message: {
        english: "Works geted successfully",
        arabic: "تم جلب الأعمال بنجاح",
      },
      works_data: works,
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
