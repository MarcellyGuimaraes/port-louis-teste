const pool = require('../config/database');

const CAMPOS = 'id, nome, telefone, criado_em, atualizado_em';

const listarTodos = async () => {
  const [contatos] = await pool.query(`SELECT ${CAMPOS} FROM contatos ORDER BY id`);
  return contatos;
};

const buscarPorId = async (id) => {
  const [contatos] = await pool.query(`SELECT ${CAMPOS} FROM contatos WHERE id = ?`, [id]);
  return contatos[0] ?? null;
};

const criar = async ({ nome, telefone }) => {
  const [resultado] = await pool.query('INSERT INTO contatos (nome, telefone) VALUES (?, ?)', [nome, telefone]);
  return buscarPorId(resultado.insertId);
};

const atualizar = async (id, dados) => {
  await pool.query('UPDATE contatos SET ? WHERE id = ?', [dados, id]);
  return buscarPorId(id);
};

const remover = async (id) => {
  const [resultado] = await pool.query('DELETE FROM contatos WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
};

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover };