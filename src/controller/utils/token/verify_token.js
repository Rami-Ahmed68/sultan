const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../config/.env" });

// import the handling error method
const ApiErrors = require("../validation_error");

// verify method
const verify_token = async (header, next) => {
  // check if the header is exists
  if (!header || !header.startsWith("Bearer")) {
    return next(
      new ApiErrors(
        JSON.stringify({
          english: "Sorry, invalid header format ...",
          arabic: "...عذرا خطأ في البيانات المرسلة",
        })
      ),
      404
    );
  }

  // extract the token from header
  const token = header.split(" ")[1];

  // check if the token isn't exists
  if (!token) {
    // return the error
    return next(
      new ApiErrors(
        JSON.stringify({
          english: "Sorry, token is required ...",
          arabic: "...عذرا يجب ارسال البيانات كاملة",
        })
      ),
      404
    );
  }

  // extract the data from token
  const token_data = jwt.verify(token, process.env.SECRET_KEY);

  // return the token data
  return token_data;
};

module.exports = verify_token;
