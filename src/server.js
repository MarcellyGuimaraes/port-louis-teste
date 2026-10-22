require('dotenv').config({ quiet: true });
const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  await pool.query('SELECT 1');
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
};

iniciarServidor().catch((erro) => {
  console.error('Não foi possível conectar ao banco de dados:', erro.message);
  process.exit(1);
});