/**
 * {Object} schema - basis validatie schema (Joi package)
 * {boolean} options.usePattern - regex pattern(letters, spaties, - en '"), (default: false)
*/
const Joi = require("joi");

function validateData(schema, data, options = { usePattern: false }) {
  let finalSchema = schema;

  if (options.usePattern) {
    finalSchema = schema.keys(
      Object.fromEntries(
        Object.keys(schema.describe().keys).map((key) => [
          key,
          schema.extract(key).pattern(/^[A-Za-z\s'-]+$/).messages({
            "string.pattern.base": `${key} can only contain letters, spaces, hyphens or apostrophes`,
          }),
        ])
      )
    );
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
