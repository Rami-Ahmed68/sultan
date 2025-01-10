const Joi = require("joi");

// validat error method
const validate_error = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    english_name: Joi.string().allow(""),
    arabic_name: Joi.string().allow(""),
    password: Joi.string().allow(""),
    english_description: Joi.string().allow(""),
    english_bio: Joi.string().allow(""),
    english_description: Joi.string().allow(""),
    english_bio: Joi.string().allow(""),
    whatsapp: Joi.string().allow(""),
    telegram: Joi.string().allow(""),
    facebook: Joi.string().allow(""),
    instgram: Joi.string().allow(""),
    linkedIn: Joi.string().allow(""),
    behance: Joi.string().allow(""),
    email_address: Joi.string().allow(""),
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
