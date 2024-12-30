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

// importing the auth files
const create_work = require("./src/router/work/create");
// importing the auth files

// redirect the request to the correct file
app.use("/api/v1/sultan/work/create", create_work);
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
