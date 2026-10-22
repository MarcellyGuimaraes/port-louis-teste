const contatoService = require('../services/contatoService');
const { validarCriacao, validarAtualizacao, validarId } = require('../validators/contatoValidator');

const listar = async (req, res) => {
  const contatos = await contatoService.listar();
  res.status(200).json(contatos);
};

const criar = async (req, res) => {
  const dados = validarCriacao(req.body);
  const contato = await contatoService.criar(dados);
  res.status(201).json(contato);
};

const atualizar = async (req, res) => {
  const id = validarId(req.params.id);
  const dados = validarAtualizacao(req.body);
  const contato = await contatoService.atualizar(id, dados);
  res.status(200).json(contato);
};

const remover = async (req, res) => {
  const id = validarId(req.params.id);
  await contatoService.remover(id);
  res.status(204).send();
};

module.exports = { listar, criar, atualizar, remover };