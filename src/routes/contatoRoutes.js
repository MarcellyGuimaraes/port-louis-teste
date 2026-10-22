const { Router } = require('express');
const contatoController = require('../controllers/contatoController');

const contatoRoutes = Router();

contatoRoutes.get('/', contatoController.listar);
contatoRoutes.post('/', contatoController.criar);

module.exports = contatoRoutes;