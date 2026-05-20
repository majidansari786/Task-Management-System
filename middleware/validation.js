const Joi = require('joi');

const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const validateInput = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ error: 'Validation error', details: messages });
    }
    
    req.validated = value;
    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ error: 'Validation error', details: messages });
    }
    
    req.validatedParams = value;
    next();
  };
};

// Validation Schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/).messages({
      'string.pattern.base': 'Password must contain at least one letter, one number, and one special character'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email()
  }).min(1),

  createTask: Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().max(500),
    status: Joi.string().valid('pending', 'in_progress', 'completed')
  }),

  updateTask: Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    status: Joi.string().valid('pending', 'in_progress', 'completed')
  }).min(1),

  taskId: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid task ID format'
    })
  })
};

module.exports = { validateEmail, validateInput, validateParams, schemas };
