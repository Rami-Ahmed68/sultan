const Joi = require("joi");

const validation_error = (data) => {
  const Schema = Joi.object().keys({
    name : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().required(),
    description : Joi.string().required(),
    bio : Joi.string().required(),
    whatsapp : Joi.string().allow(''),
    phone : Joi.string().allow(''),
    links : Joi.array().allow(''),
  });

  // validate data
  const Error = Schema.validate(data);

  // check if the data has any error and return it
  if (Error.error) {
    return Error;
  } else {
    return true
  }
};

module.exports = validation_error;