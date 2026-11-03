require('dotenv').config();
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');

module.exports = {
  port: Number(process.env.PORT) || 3000,
  uploadDir: path.join(rootDir, process.env.UPLOAD_DIR || 'uploads/products'),
  uploadsRoot: path.join(rootDir, 'uploads'),
  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 2 * 1024 * 1024,
  categories: ['electronics', 'clothing', 'food', 'other'],
};
