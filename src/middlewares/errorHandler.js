const AppError = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'O corpo da requisição não é um JSON válido' });
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
};

module.exports = errorHandler;