const multer = require('multer');
const { maxFileSize } = require('../config');

function notFound(req, res) {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `Файл слишком большой (максимум ${maxFileSize / 1024 / 1024} МБ)`
        : err.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Ожидается один файл в поле "image"'
          : err.message;
    return res.status(400).json({ error: message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Внутренняя ошибка сервера' : err.message,
  });
}

module.exports = { notFound, errorHandler };
