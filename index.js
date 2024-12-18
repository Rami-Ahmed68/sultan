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

const create = require("./src/router/auth/create");

app.use("/test", create);

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
