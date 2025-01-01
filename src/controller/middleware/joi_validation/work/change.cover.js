const Joi = require("joi");

const validation_error = (data) => {
  // create the Schema
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    work_id: Joi.string().required(),
  });

  // validate the body data
  const Error = Schema.validate(data);

  // check if the data has any error and return it
  if (Error.error) {
    return Error;
  } else {
    return true;
  }
};

module.exports = validation_error;
