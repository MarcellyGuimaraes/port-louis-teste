const { Router } = require('express');
const contatoController = require('../controllers/contatoController');

const contatoRoutes = Router();

contatoRoutes.get('/', contatoController.listar);
contatoRoutes.post('/', contatoController.criar);
contatoRoutes.patch('/:id', contatoController.atualizar);
contatoRoutes.delete('/:id', contatoController.remover);

module.exports = contatoRoutes;