const express = require("express");
const router = express.Router();

// import the validate error method
const ApiErrors = require("../../controller/utils/validation_error");

// import the User (admin) model
const User = require("../../model/user/user");

// import the skill model
const Skill = require("../../model/skills/skills");

// import the validatebody data method
const validation_data = require("../../controller/middleware/joi_validation/skill/create");

// import the upload image to cloudinary method
const upload_cloudinary_images = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import the upload files method
const upload_icon = require("../../controller/utils/multer/skill/upload.skill");

// import delete the uploaded files method
const DeleteImage = require("../../controller/utils/multer/delete.files");

// import the verifytoken data method
const verify_toen = require("../../controller/utils/token/verify_token");

router.post("/", upload_icon, async (req, res, next) => {
  try {
    //validate the body data
    const Error = validation_data(req.body);

    // check if the body has any error
    if (Error.error) {
      // delete the uploaded images
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
      // delete the uploaded icons
      for (let i = 0; i < req.files.length; i++) {
        DeleteImage(req.files[i], next);
      }

      // return error
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

    // verify the token data
    const verify_token_data = await verify_toen(
      req.headers.authorization,
      next
    );

    // find the admin by his id
    const admin = await User.findById(verify_token_data._id);

    // check if the admin is exists
    if (!admin) {
      // delete all uploaded images
      DeleteImage(req.files[0], next);

      // return error
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

    // create the skill
    const skill = new Skill({
      title: req.body.title,
      description: req.body.description,
      created_at: req.body.created_at,
    });

    // upload the icon
    const icon = await upload_cloudinary_images(req.files[0], "skill", next);

    // set the uploaded icon to the skill
    skill.icon = icon;

    // delete the uploaded icon from folder
    DeleteImage(req.files[0], next);

    // save the skill in data base
    await skill.save();

    // create response
    const response = {
      message: {
        english: "Skill created successfully ...",
        arabic: "ام انشاء المهارة بنجاح",
      },
      skill_data: skill,
    };

    // send the response to clint
    res.status(200).send(response);
  } catch (error) {
    // delete the uploaded image
    DeleteImage(req.files[0], next);

    // return the error
    return next(
      new ApiErrors(
        JSON.stringify({
          english: `${error} ...`,
          arabic: "... عذراخطأ عام",
        }),
        500
      )
    );
  }
});

module.exports = router;
