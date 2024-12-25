const Joi = require("joi");

// validat error method
const validate_error = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    _id: Joi.string().required(),
  });

  // validate the body data
  const Error = Schema.validate(data);

  // check if the data has any error or not and return it
  if (Error.error) {
    return Error.error;
  } else {
    return true;
  }
};

module.exports = validate_error;
