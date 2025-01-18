const Joi = require("joi");

const validate_data = (data) => {
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    message_id: Joi.string().required(),
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

module.exports = validate_data;
