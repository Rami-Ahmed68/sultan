const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./src/config/.env" });
const app = express();
app.use(express.json());
const cors = require("cors");

// select the api methods and origin ( who can use the api's )
const cors_options = {
  origin: "*",
  methods: "GET,PUT,POST,DELETE",
};

// to allow use the api
app.use(cors(cors_options));

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
const get_admin_links = require("./src/router/auth/get_links");
const get_admin_links = require("./src/router/auth/get_links");
const get_admin_cv = require("./src/router/auth/get.cv");
// importing the auth files

// redirect the request to the correct file
app.use("/api/v1/sultan/create", create_admin);
app.use("/api/v1/sultan/login", login);
app.use("/api/v1/sultan/update", update_admin);
app.use("/api/v1/sultan/avatar", change_avatar);
app.use("/api/v1/sultan/cv", change_cv);
app.use("/api/v1/sultan/get", get_admin_data);
app.use("/api/v1/sultan/get/links", get_admin_links);
app.use("/api/v1/sultan/get/cv", get_admin_cv);
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
const update_skill = require("./src/router/skills/update");
const get_skill = require("./src/router/skills/get.one");
const get_skills = require("./src/router/skills/get.all");
const change_icon_skill = require("./src/router/skills/change.icon");
// importing the skill files

// redirect the request to the correct file
app.use("/api/v1/sultan/skill/create", create_skill);
app.use("/api/v1/sultan/skill/delete", delete_skill);
app.use("/api/v1/sultan/skill/update", update_skill);
app.use("/api/v1/sultan/skill/get/one", get_skill);
app.use("/api/v1/sultan/skill/get/all", get_skills);
app.use("/api/v1/sultan/skill/change/icon", change_icon_skill);
// redirect the request to the correct file

// importing the skill page status files
const change_skills_page_status = require("./src/router/skills_page/change.skills.page.status");
// importing the skill page status files

// redirect the request to the correct file
app.use("/api/v1/sultan/skills/page/change/status", change_skills_page_status);
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
  .connect(process.env.MONGODB_SECRET)
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
