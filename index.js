const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./src/config/.env" });
const app = express();
app.use(express.json());

// import error validation method
const Global = require("./src/controller/middleware/validation_error/validation_error");
const ApiErrors = require("./src/controller/utils/validation_error");
// import error validation method

// importing the auth files
const create_admin = require("./src/router/auth/create");
const login = require("./src/router/auth/login");
const update_admin = require("./src/router/auth/update");
const change_avatar = require("./src/router/auth/change.avatar");
const change_cv = require("./src/router/auth/change.cv");
const get_admin_data = require("./src/router/auth/get");
// importing the auth files

// redirect the request to the correct file
app.use("/api/v1/sultan/create", create_admin);
app.use("/api/v1/sultan/login", login);
app.use("/api/v1/sultan/update", update_admin);
app.use("/api/v1/sultan/avatar", change_avatar);
app.use("/api/v1/sultan/cv", change_cv);
app.use("/api/v1/sultan/get", get_admin_data);
// redirect the request to the correct file

// importing the work files
const create_work = require("./src/router/work/create");
const delete_work = require("./src/router/work/delete");
const update_work = require("./src/router/work/update");
const change_work_cover = require("./src/router/work/change.cover");
const get_work = require("./src/router/work/get.one");
const get_works = require("./src/router/work/get.all");
// importing the work files

// redirect the request to the correct file
app.use("/api/v1/sultan/work/create", create_work);
app.use("/api/v1/sultan/work/delete", delete_work);
app.use("/api/v1/sultan/work/update", update_work);
app.use("/api/v1/sultan/work/cover/update", change_work_cover);
app.use("/api/v1/sultan/work/get/one", get_work);
app.use("/api/v1/sultan/work/get/all", get_works);
// redirect the request to the correct file

// importing the lesson files
const create_lesson = require("./src/router/lesson/create");
const delete_lesson = require("./src/router/lesson/delete");
const update_lesson = require("./src/router/lesson/update");
const change_lesson_cover = require("./src/router/lesson/change.cover");
const get_lesson = require("./src/router/lesson/get.one");
const get_lessons = require("./src/router/lesson/get.all");
// importing the lesson files

// redirect the request to the correct file
app.use("/api/v1/sultan/lesson/create", create_lesson);
app.use("/api/v1/sultan/lesson/delete", delete_lesson);
app.use("/api/v1/sultan/lesson/update", update_lesson);
app.use("/api/v1/sultan/lesson/cover/update", change_lesson_cover);
app.use("/api/v1/sultan/lesson/get/one", get_lesson);
app.use("/api/v1/sultan/lesson/get/all", get_lessons);
// redirect the request to the correct file

// importing the skill files
const create_skill = require("./src/router/skills/create");
const delete_skill = require("./src/router/skills/delete");
// importing the skill files

// redirect the request to the correct file
app.use("/api/v1/sultan/skill/create", create_skill);
app.use("/api/v1/sultan/skill/delete", delete_skill);
// redirect the request to the correct file

// handling not found
app.use("*", (req, res, next) => {
  return next(
    new ApiErrors(
      JSON.stringify({
        english: "Invalid Api Not Found ...",
        arabic: "... (API) عذرا لم يتم العثور على الرابط",
      }),
      404
    )
  );
});
// handling not found

// handling error method
app.use(Global);
// handling error method

//! connecting to data base
mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    console.log("#####connected#####");
  })
  .catch((error) => {
    console.log(error);
  });

//? starting the project on PORT
app.listen(process.env.PORT, () => {
  console.log(`Sultan's Project Running on port : ${process.env.PORT}`);
});
