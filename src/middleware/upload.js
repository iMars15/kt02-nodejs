const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { uploadDir, maxFileSize } = require('../config');

const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png' };

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = ALLOWED[file.mimetype] || path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (ALLOWED[file.mimetype]) return cb(null, true);
  const err = new Error('Разрешены только изображения JPEG и PNG');
  err.status = 400;
  cb(err);
}

module.exports = multer({ storage, fileFilter, limits: { fileSize: maxFileSize, files: 1 } });
