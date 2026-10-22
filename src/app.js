const express = require('express');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use(errorHandler);

module.exports = app;