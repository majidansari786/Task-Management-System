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

module.exports = { validateEmail, validateInput };
