const Joi = require("joi");

// validat error method
const validate_data = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
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

module.exports = validate_data;
