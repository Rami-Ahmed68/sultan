const Joi = require("joi");

const validation_data = (data) => {
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    work_id: Joi.string().required(),
    title: Joi.string(),
    description: Joi.string(),
    link: Joi.string(),
    created_at: Joi.string(),
    tags: Joi.string(),
    images_for_delete: Joi.string(),
    video_reaction: Joi.string(),
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
