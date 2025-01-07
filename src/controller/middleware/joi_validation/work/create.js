const Joi = require("joi");

const validation_data = (data) => {
  const Schema = Joi.object().keys({
    english_title: Joi.string().required(),
    arabic_title: Joi.string().required(),
    english_description: Joi.string().required(),
    arabic_description: Joi.string().required(),
    link: Joi.string(),
    created_at: Joi.string().required(),
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

module.exports = validation_data;
