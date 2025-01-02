const express = require("express");
const router = express.Router();

// import validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the validate Work model
const Work = require("../../model/work/work");

router.get("/", async (req, res, next) => {
  try {
    // get the work by his id
    const work = await Work.findById(req.query.work_id);

    // check if the body is exists or not
    if (!work) {
      // return error
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

    // create the response
    const response = {
      message: {
        english: "Work geted successfully",
        arabic: "تم العثور على العمل بنجاح",
      },
      work_data: work,
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
