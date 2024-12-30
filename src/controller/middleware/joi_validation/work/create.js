const Joi = require("joi");

const validation_error = (data) => {
  const Schema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string(),
    created_at: Joi.string(),
    tags: Joi.string().required(),
  });

  // validate data
  const Error = Schema.validate(data);

  // check if the data has any error and return it
  if (Error.error) {
    return Error;
  } else {
    return true;
  }
};

module.exports = validation_error;
