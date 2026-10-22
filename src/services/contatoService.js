const contatoRepository = require('../repositories/contatoRepository');
const AppError = require('../errors/AppError');

const CONTATO_NAO_ENCONTRADO = 'Contato não encontrado';

const listar = () => contatoRepository.listarTodos();

const criar = (dados) => contatoRepository.criar(dados);

const atualizar = async (id, dados) => {
  const contatoExistente = await contatoRepository.buscarPorId(id);

  if (!contatoExistente) {
    throw new AppError(CONTATO_NAO_ENCONTRADO, 404);
  }

  return contatoRepository.atualizar(id, dados);
};

const remover = async (id) => {
    const foiRemovido = await contatoRepository.remover(id);
  
    if (!foiRemovido) {
      throw new AppError(CONTATO_NAO_ENCONTRADO, 404);
    }
  };
  
  module.exports = { listar, criar, atualizar, remover };