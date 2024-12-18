const Joi = require("joi");

const validation_error = (data) => {
  // create Schema
  const Schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  // validate the error
  const Error = Schema.validate(data);

  // check if the data hase any error and rutern it
  if (Error.error) {
    return Error;
  } else {
    return true;
  }
};

module.exports = validation_error;
