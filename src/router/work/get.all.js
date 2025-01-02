const express = require("express");
const router = express.Router();

// import validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the work model
const Work = require("../../model/work/work");

router.get("/", async (req, res, next) => {
  try {
    // create the page var
    const page = req.query.page || 1;

    // create the limit var
    const limit = req.query.limit || 5;

    // create the skip of document var
    const skip = (page - 1) * limit;

    // get the works
    const works = await Work.find().skip(skip).limit(limit).sort({ _id: -1 });

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
