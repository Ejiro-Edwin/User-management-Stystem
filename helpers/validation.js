const Joi = require ('@hapi/joi');

const registerUserSchema = params => {
  const schema = {
    firstname: Joi.string ().min (2).max (50).required (),
    lastname: Joi.string ().min (2).max (50).required (),
    email: Joi.string ().min (5).max (255).required ().email (),
    password: Joi.string ().min (5).max (255).required (),
    phoneNumber: Joi.string ().min (5).max (15).required (),
    address: Joi.string ().min (5).max (255).required (),
    company: Joi.string ().min (5).max (255).required (),
    website: Joi.string ().min (5).max (255).required (),
    dob: Joi.string ().min (5).max (255).required (),
  };
  return Joi.validate (params, schema);
};

const loginSchema = params => {
  const schema = {
      email: Joi.string()
          .min(5)
          .max(255)
          .required()
          .email(),
      password: Joi.string()
          .min(5)
          .max(255)
          .required()
  };
  return Joi.validate(params, schema);
};

module.exports = {
  registerUserSchema,loginSchema
};