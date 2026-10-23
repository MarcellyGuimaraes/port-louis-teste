const AppError = require('../errors/AppError');

const PALAVRA_VALIDA = /^\p{L}{3,}$/u;
const MIN_PALAVRAS_NOME = 2;
const MAX_CARACTERES_NOME = 100;
const TELEFONE_VALIDO = /^\d{10,11}$/;

const normalizarNome = (nome) => nome.trim().replace(/\s+/g, ' ');

const normalizarTelefone = (telefone) => telefone.replace(/\D/g, '');

const validarNome = (nome) => {
  if (typeof nome !== 'string') {
    throw new AppError('O nome é obrigatório e deve ser um texto');
  }

  const nomeNormalizado = normalizarNome(nome);

  if (nomeNormalizado.length > MAX_CARACTERES_NOME) {
    throw new AppError(`O nome deve ter no máximo ${MAX_CARACTERES_NOME} caracteres`);
  }

  const palavras = nomeNormalizado.split(' ');
  const nomeValido =
    palavras.length >= MIN_PALAVRAS_NOME && palavras.every((palavra) => PALAVRA_VALIDA.test(palavra));

  if (!nomeValido) {
    throw new AppError('O nome deve ter pelo menos duas palavras, cada uma com no mínimo 3 letras');
  }

  return nomeNormalizado;
};

const validarTelefone = (telefone) => {
  if (typeof telefone !== 'string') {
    throw new AppError('O telefone é obrigatório e deve ser um texto');
  }

  const telefoneNormalizado = normalizarTelefone(telefone);

  if (!TELEFONE_VALIDO.test(telefoneNormalizado)) {
    throw new AppError('O telefone deve ter 10 ou 11 dígitos, incluindo o DDD');
  }

  return telefoneNormalizado;
};

const validarCriacao = ({ nome, telefone } = {}) => ({
  nome: validarNome(nome),
  telefone: validarTelefone(telefone),
});

const validarAtualizacao = ({ nome, telefone } = {}) => {
  if (nome === undefined && telefone === undefined) {
    throw new AppError('Informe ao menos o nome ou o telefone para atualizar');
  }

  return {
    ...(nome !== undefined && { nome: validarNome(nome) }),
    ...(telefone !== undefined && { telefone: validarTelefone(telefone) }),
  };
};

const validarId = (id) => {
  const idNumerico = Number(id);

  if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
    throw new AppError('O id deve ser um número inteiro positivo');
  }

  return idNumerico;
};

module.exports = { validarCriacao, validarAtualizacao, validarId };