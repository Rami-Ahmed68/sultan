const Joi = require("joi");

const validation_data = (data) => {
  const Schema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    created_at: Joi.string().required(),
    link: Joi.string(),
    tags: Joi.string(),
    program: Joi.string().required(),
    level: Joi.string().required(),
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

module.exports = validation_data;
