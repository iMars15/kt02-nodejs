const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  validate,
  productSchema,
  productPatchSchema,
  querySchema,
} = require('../middleware/validate');
const upload = require('../middleware/upload');
const { uploadDir } = require('../config');

const router = express.Router();

// Хранилище в памяти
let products = [];
let nextId = 1;

// Находит товар по :id и кладёт в req.product
function findProduct(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'id должен быть положительным целым числом' });
  }
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  req.product = product;
  next();
}

function removeImageFile(imageUrl) {
  if (!imageUrl) return;
  fs.unlink(path.join(uploadDir, path.basename(imageUrl)), () => {});
}

// GET /api/products
router.get('/', validate(querySchema, 'query'), (req, res) => {
  const { category, minPrice, maxPrice, page, limit } = req.validQuery;

  let result = products;
  if (category) result = result.filter((p) => p.category === category);
  if (minPrice !== undefined) result = result.filter((p) => p.price >= minPrice);
  if (maxPrice !== undefined) result = result.filter((p) => p.price <= maxPrice);

  const total = result.length;
  const start = (page - 1) * limit;
  res.json({ data: result.slice(start, start + limit), total, page, limit });
});

// GET /api/products/:id
router.get('/:id', findProduct, (req, res) => res.json(req.product));

// POST /api/products
router.post('/', validate(productSchema), (req, res) => {
  const product = {
    id: nextId++,
    ...req.body,
    imageUrl: null,
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  res.status(201).json(product);
});

// PUT /api/products/:id — полная замена (id, createdAt, imageUrl сохраняются)
router.put('/:id', findProduct, validate(productSchema), (req, res) => {
  const { id, createdAt, imageUrl } = req.product;
  const updated = { id, ...req.body, imageUrl, createdAt };
  products[products.findIndex((p) => p.id === id)] = updated;
  res.json(updated);
});

// PATCH /api/products/:id — частичное обновление
router.patch('/:id', findProduct, validate(productPatchSchema), (req, res) => {
  Object.assign(req.product, req.body);
  res.json(req.product);
});

// DELETE /api/products/:id
router.delete('/:id', findProduct, (req, res) => {
  removeImageFile(req.product.imageUrl);
  products = products.filter((p) => p.id !== req.product.id);
  res.status(204).end();
});

// POST /api/products/:id/image — поле формы "image"
router.post('/:id/image', findProduct, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не передан (поле "image")' });
  }
  removeImageFile(req.product.imageUrl);
  req.product.imageUrl = `/uploads/products/${req.file.filename}`;
  res.json(req.product);
});

module.exports = router;
