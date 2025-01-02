const Joi = require("joi");

const validation_data = (data) => {
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    lesson_id: Joi.string().required(),
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
