# API de Contatos

API REST para gerenciar uma lista de contatos (nome e telefone), com criação, listagem, atualização e exclusão, usando Node.js, Express e MySQL.

## Tecnologias

- Node.js
- Express 5
- MySQL 8 (via Docker)
- mysql2
- dotenv

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Docker](https://www.docker.com/) com Docker Compose **ou** um MySQL instalado localmente

## Como rodar

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

| Variável      | Descrição                  | Padrão        |
|---------------|----------------------------|---------------|
| `PORT`        | Porta da API               | `3000`        |
| `DB_HOST`     | Endereço do MySQL          | `127.0.0.1`   |
| `DB_PORT`     | Porta do MySQL             | `3306`        |
| `DB_USER`     | Usuário do MySQL           | `root`        |
| `DB_PASSWORD` | Senha do MySQL             | `root`        |
| `DB_NAME`     | Nome do banco de dados     | `contatos_db` |

### 3. Suba o banco de dados

**Opção A: com Docker (recomendado)**

```bash
docker compose up -d
```

O container usa as credenciais do `.env`, cria o banco e executa o `database/schema.sql` automaticamente na primeira inicialização. Na primeira vez, o MySQL leva alguns segundos para ficar pronto.

> Se já existir um MySQL usando a porta 3306, altere `DB_PORT` no `.env` (por exemplo, para `3307`).

**Opção B: com um MySQL instalado localmente**

Ajuste o `.env` com as credenciais do seu MySQL e crie o banco e a tabela:

```sql
CREATE DATABASE contatos_db;
USE contatos_db;
SOURCE database/schema.sql;
```

### 4. Inicie a API

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`. Para rodar sem o modo de desenvolvimento, use `npm start`.

Se o banco não estiver acessível, a aplicação exibe o erro de conexão e encerra.

## Rotas

| Método   | Rota             | Descrição                  | Sucesso |
|----------|------------------|----------------------------|---------|
| `POST`   | `/contatos`      | Cria um contato            | `201`   |
| `GET`    | `/contatos`      | Lista todos os contatos    | `200`   |
| `PATCH`  | `/contatos/:id`  | Atualiza um contato        | `200`   |
| `DELETE` | `/contatos/:id`  | Exclui um contato          | `204`   |

### Criar contato

```bash
curl -X POST http://localhost:3000/contatos \
  -H "Content-Type: application/json" \
  -d '{"nome": "José Conceição", "telefone": "(11) 98765-4321"}'
```

Resposta `201`:

```json
{
  "id": 1,
  "nome": "José Conceição",
  "telefone": "11987654321",
  "criado_em": "2026-10-22T21:04:07.000Z",
  "atualizado_em": "2026-10-22T21:04:07.000Z"
}
```

### Listar contatos

```bash
curl http://localhost:3000/contatos
```

### Atualizar contato

Aceita atualização parcial: é possível enviar apenas `nome`, apenas `telefone` ou os dois.

```bash
curl -X PATCH http://localhost:3000/contatos/1 \
  -H "Content-Type: application/json" \
  -d '{"telefone": "1133334444"}'
```

### Excluir contato

```bash
curl -X DELETE http://localhost:3000/contatos/1
```

### Erros

Todos os erros retornam um JSON no formato:

```json
{ "erro": "Contato não encontrado" }
```

| Status | Quando                                                        |
|--------|---------------------------------------------------------------|
| `400`  | Dados inválidos, id inválido ou JSON malformado               |
| `404`  | Contato ou rota não encontrados                               |
| `500`  | Erro inesperado no servidor                                   |

## Validações

- **Nome**: obrigatório, com no mínimo duas palavras, cada uma com pelo menos 3 letras. Letras acentuadas são aceitas. Espaços extras são removidos.
- **Telefone**: obrigatório, com 10 ou 11 dígitos incluindo o DDD. Máscaras como `(11) 98765-4321` são aceitas e o telefone é salvo apenas com os dígitos.
- **Id**: deve ser um número inteiro positivo.

## Decisões técnicas

- **DELETE retorna `204` sem corpo.** O enunciado pede uma mensagem de sucesso com status `204`, mas pela especificação HTTP o `204 No Content` não possui corpo de resposta. Optei por seguir o padrão HTTP; o próprio status indica o sucesso da operação.
- **Regra do nome aplicada de forma literal.** Como cada palavra precisa ter pelo menos 3 letras, nomes com preposições curtas, como "Maria da Silva", são recusados. Mantive a regra conforme especificada.
- **Regra do telefone.** O enunciado não define um formato, então adotei o padrão brasileiro com DDD: 10 dígitos para fixo e 11 para celular.
- **PATCH como atualização parcial**, seguindo a semântica do método. Campos desconhecidos no corpo são ignorados.
- **Arquitetura em camadas** (rotas, controllers, services e repositories) para separar as responsabilidades de HTTP, regra de negócio e acesso a dados.
- **Consultas parametrizadas** em todas as queries, evitando SQL injection.

## Estrutura do projeto

```
├── database/
│   └── schema.sql
├── src/
│   ├── config/          # conexão com o banco
│   ├── controllers/     # entrada e saída HTTP
│   ├── errors/          # erro de aplicação com status HTTP
│   ├── middlewares/     # tratamento centralizado de erros
│   ├── repositories/    # acesso ao banco de dados
│   ├── routes/          # definição das rotas
│   ├── services/        # regras de negócio
│   ├── validators/      # validação e normalização dos dados
│   ├── app.js
│   └── server.js
├── .env.example
├── docker-compose.yml
└── package.json
```