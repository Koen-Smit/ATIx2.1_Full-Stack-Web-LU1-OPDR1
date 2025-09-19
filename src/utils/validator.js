/**
 * {Object} schema - basis validatie schema (Joi package)
 * {boolean} options.usePattern - regex pattern(letters, spaties, - en '"), (default: false)
*/
const Joi = require("joi");

function validateData(schema, data, options = { usePattern: false }) {
  let finalSchema = schema;

  if (options.usePattern) {
    const schemaDescription = schema.describe();
    const newKeys = {};
    
    Object.keys(schemaDescription.keys).forEach((key) => {
      const originalField = schemaDescription.keys[key];
      if (originalField.type === 'string') {
        let newField = Joi.string();
        
        // Apply min length
        const minRule = originalField.rules?.find(r => r.name === 'min');
        if (minRule) {
          newField = newField.min(minRule.args.limit);
        }
        
        // Apply max length
        const maxRule = originalField.rules?.find(r => r.name === 'max');
        if (maxRule) {
          newField = newField.max(maxRule.args.limit);
        }
        
        const emailRule = originalField.rules?.find(r => r.name === 'email');
        if (emailRule || key.toLowerCase().includes('email')) {
          newField = newField.email().messages({
            "string.email": `${key} must be a valid email address`,
          });
          
          if (originalField.allow && originalField.allow.includes('')) {
            newField = newField.allow('');
          }
        } else {
          newField = newField.pattern(/^[A-Za-z\s'-]+$/).messages({
            "string.pattern.base": `${key} can only contain letters, spaces, hyphens or apostrophes`,
          });
        }
        
        if (originalField.flags?.presence === 'required') {
          newField = newField.required();
        }
        
        newKeys[key] = newField;
      } else {
        if (originalField.type === 'number') {
          let numberField = Joi.number();
          if (originalField.flags?.presence === 'required') {
            numberField = numberField.required();
          }
          newKeys[key] = numberField;
        } else {
          let basicField = Joi.any();
          if (originalField.flags?.presence === 'required') {
            basicField = basicField.required();
          }
          newKeys[key] = basicField;
        }
      }
    });
    
    finalSchema = Joi.object(newKeys);
  }

  const { error, value } = finalSchema.validate(data, { abortEarly: false, stripUnknown: true });

  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    const err = new Error(message);
    err.status = 400;
    throw err;
  }

  return value;
}

module.exports = { validateData, Joi };
