const Joi = require("joi");

// validat error method
const validate_error = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    name: Joi.string().allow(""),
    password: Joi.string().allow(""),
    description: Joi.string().allow(""),
    bio: Joi.string().allow(""),
    whatsapp: Joi.string().allow(""),
    phone: Joi.string().allow(""),
    skills_page_status: Joi.boolean().required(),
  });

  // validate the body data
  const Error = Schema.validate(data);

  // check if the data has any error or not and return it
  if (Error.error) {
    return Error;
  } else {
    return true;
  }
};

module.exports = validate_error;
