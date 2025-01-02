const Joi = require("joi");

const validation_error = (data) => {
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    skill_id: Joi.string().required(),
    title: Joi.string(),
    description: Joi.string(),
    created_at: Joi.string(),
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
