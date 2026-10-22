const contatoRepository = require('../repositories/contatoRepository');

const listar = () => contatoRepository.listarTodos();

const criar = (dados) => contatoRepository.criar(dados);

module.exports = { listar, criar };