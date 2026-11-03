const Joi = require('joi');
const { categories } = require('../config');

const fields = {
  name: Joi.string().min(2).max(100),
  price: Joi.number().greater(0),
  category: Joi.string().valid(...categories),
  stock: Joi.number().integer().min(0),
  description: Joi.string().max(500).allow(''),
};

// POST / PUT — полный объект
const productSchema = Joi.object({
  name: fields.name.required(),
  price: fields.price.required(),
  category: fields.category.required(),
  stock: fields.stock.default(0),
  description: fields.description,
});

// PATCH — любые поля, но хотя бы одно
const productPatchSchema = Joi.object(fields).min(1);

// GET /api/products
const querySchema = Joi.object({
  category: fields.category,
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

function formatError(error) {
  return error.details.map((d) => ({
    field: d.path.join('.'),
    message: d.message,
  }));
}

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: formatError(error) });
    }
    if (source === 'query') req.validQuery = value;
    else req.body = value;
    next();
  };
}

module.exports = { validate, productSchema, productPatchSchema, querySchema };
