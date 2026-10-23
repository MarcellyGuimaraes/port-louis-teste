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

O comando funciona no Bash e no PowerShell. O `.env` não é versionado porque guarda as credenciais do banco; por isso o repositório traz apenas o `.env.example`, com todas as variáveis e valores de exemplo.

| Variável      | Descrição                                         | Padrão        |
|---------------|---------------------------------------------------|---------------|
| `PORT`        | Porta da API                                      | `3000`        |
| `DB_HOST`     | Endereço do MySQL                                 | `127.0.0.1`   |
| `DB_PORT`     | Porta do MySQL                                    | `3306`        |
| `DB_USER`     | Usuário do MySQL                                  | `root`        |
| `DB_PASSWORD` | Senha do MySQL                                    | `root`        |
| `DB_NAME`     | Nome do banco de dados                            | `contatos_db` |
| `DB_SSL_CA`   | Certificado da CA para conexão com SSL (opcional) | vazio         |

#### Conexão com SSL (opcional)

Para rodar localmente, deixe `DB_SSL_CA` vazia. Ela só é necessária quando o MySQL exige conexão com SSL, como nos serviços gerenciados do [Aiven](https://aiven.io/). Nesse caso, baixe o certificado da CA (**CA certificate**) na página de visão geral do serviço no console do Aiven e coloque o conteúdo do arquivo PEM no `.env`, **entre aspas duplas**. As quebras de linha podem ficar no próprio valor:

```env
DB_SSL_CA="-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIU...
...
-----END CERTIFICATE-----"
```

ou ficar em uma linha só, com `\n` no lugar de cada quebra:

```env
DB_SSL_CA="-----BEGIN CERTIFICATE-----\nMIIEQTCCAqmgAwIBAgIU...\n-----END CERTIFICATE-----"
```

Com a variável preenchida, a conexão passa a usar SSL e valida o certificado do servidor com essa CA. Preencha também `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` com os dados do serviço.

### 3. Suba o banco de dados

**Opção A: com Docker (recomendado)**

Com o container do projeto, o `DB_USER` **tem que ser `root`**: o container cria só o usuário `root`, com a senha definida em `DB_PASSWORD`, e o banco com o nome definido em `DB_NAME`.

```bash
docker compose up -d
```

Na primeira inicialização, o container cria o banco e executa o `database/schema.sql` automaticamente. Isso leva alguns segundos. Para saber quando o MySQL está pronto, acompanhe os logs e espere aparecer a linha `ready for connections` com `port: 3306` (saia com `Ctrl+C`). Na primeira inicialização, essa mensagem aparece antes com `port: 0`: é um servidor temporário, usado só para criar o banco, que ainda não aceita conexões.

```bash
docker compose logs -f mysql
```

> Se já existir um MySQL usando a porta 3306, altere `DB_PORT` no `.env` (por exemplo, para `3307`).

As credenciais e o nome do banco só são aplicados na primeira inicialização, quando o volume do banco é criado. Se você alterar `DB_PASSWORD` ou `DB_NAME` depois disso, recrie o volume e suba o container de novo. **Atenção: isso apaga todos os dados do banco.**

```bash
docker compose down -v
docker compose up -d
```

**Opção B: com um MySQL instalado localmente**

Ajuste o `.env` com as credenciais do seu MySQL. Depois, na raiz do projeto, crie o banco e a tabela. O nome do banco nos comandos (`contatos_db`) **tem que ser igual ao valor de `DB_NAME`** no `.env`. Troque `root` pelo seu usuário, se for outro; a senha é pedida a cada comando.

No Bash (Linux, macOS ou Git Bash):

```bash
mysql -u root -p -e "CREATE DATABASE contatos_db"
mysql -u root -p contatos_db < database/schema.sql
```

No PowerShell, que não aceita o redirecionamento com `<`:

```powershell
mysql -u root -p -e "CREATE DATABASE contatos_db"
Get-Content database/schema.sql | mysql -u root -p contatos_db
```

### 4. Inicie a API

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`. Para rodar sem o modo de desenvolvimento, use `npm start`.

Se o banco não estiver acessível, a aplicação exibe o erro de conexão e encerra.

Há também uma instância em produção: [https://port-louis-teste.onrender.com](https://port-louis-teste.onrender.com).

## Collection do Postman

As requisições da API estão na collection `docs/contatos.postman_collection.json`. Ela cobre criar, listar, atualizar e excluir contatos, com um conjunto de requisições para `http://localhost:3000` e outro para a URL de produção.

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

> **Windows:** no Git Bash, o `curl` pode enviar letras acentuadas em outra codificação que não UTF-8, e a API recusa o nome com `400`. Nesse caso, escreva os acentos com escapes Unicode do JSON (`\u00e9` para "é", `\u00e7` para "ç", `\u00e3` para "ã") ou use um cliente HTTP como Postman ou Insomnia:
>
> ```bash
> curl -X POST http://localhost:3000/contatos \
>   -H "Content-Type: application/json" \
>   -d '{"nome": "Jos\u00e9 Concei\u00e7\u00e3o", "telefone": "(11) 98765-4321"}'
> ```

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

- **Nome**: obrigatório, com no mínimo duas palavras, cada uma com pelo menos 3 letras. Letras acentuadas são aceitas. Espaços extras são removidos. Depois disso, o nome pode ter no máximo 100 caracteres.
- **Telefone**: obrigatório, com 10 ou 11 dígitos incluindo o DDD. Máscaras como `(11) 98765-4321` são aceitas e o telefone é salvo apenas com os dígitos.
- **Id**: deve ser um número inteiro positivo.

## Decisões técnicas

- **DELETE retorna `204` sem corpo.** O enunciado pede uma mensagem de sucesso com status `204`, mas pela especificação HTTP o `204 No Content` não possui corpo de resposta. Optei por seguir o padrão HTTP; o próprio status indica o sucesso da operação.
- **Regra do nome aplicada de forma literal.** Como cada palavra precisa ter pelo menos 3 letras, nomes com preposições curtas, como "Maria da Silva", são recusados. Mantive a regra conforme especificada.
- **Regra do telefone.** O enunciado não define um formato, então adotei o padrão brasileiro com DDD: 10 dígitos para fixo e 11 para celular.
- **PATCH como atualização parcial**, seguindo a semântica do método. Campos desconhecidos no corpo são ignorados.
- **Arquitetura em camadas** (rotas, controllers, services e repositories) para separar as responsabilidades de HTTP, regra de negócio e acesso a dados.
- **Consultas parametrizadas** em todas as queries, evitando SQL injection.
- **`.env` fora do repositório.** As credenciais ficam no `.env`, que é criado localmente a partir do `.env.example` e está no `.gitignore`, para que nenhuma senha seja versionada.

## Estrutura do projeto

```
├── database/
│   └── schema.sql
├── docs/
│   └── contatos.postman_collection.json
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