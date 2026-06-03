function notFound(req, res) {
  return res.status(404).json({ message: 'Rota não encontrada.' });
}

function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || 'Erro interno do servidor.';

  return res.status(status).json({ message });
}

module.exports = {
  notFound,
  errorHandler
};
