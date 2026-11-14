# DevBlog

**Uma rede social para compartilhar publicações, ideias e conhecimentos sobre tecnologia e desenvolvimento de software.**

O DevBlog é uma aplicação web inspirada em redes sociais, desenvolvida para conectar pessoas interessadas em tecnologia. A plataforma permite criar publicações, compartilhar imagens, interagir com conteúdos e personalizar perfis.

O projeto está sendo desenvolvido com foco em boas práticas de programação, organização da arquitetura backend, autenticação e segurança.

## Funcionalidades

- Cadastro e autenticação de usuários.
- Login com autenticação baseada em JWT.
- Criação, edição e exclusão de publicações.
- Upload e armazenamento de imagens.
- Perfis públicos de usuários.
- Edição de informações e foto de perfil.
- Curtidas em publicações.
- Área de comentários.
- Interface com suporte a português, inglês e espanhol.
- Tema claro e escuro.

## Tecnologias utilizadas

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (JSON Web Token)
- bcrypt
- Zod
- Winston

### Frontend
- HTML5
- CSS3
- JavaScript

### Serviços, bibliotecas e ferramentas
- Neon — hospedagem do banco PostgreSQL.
- Cloudinary — armazenamento de imagens.
- RabbitMQ / amqplib — infraestrutura de mensageria.
- Socket.IO — comunicação em tempo real.
- New Relic — monitoramento e observabilidade.
- i18next — internacionalização.
- Git e GitHub — versionamento de código.

## Arquitetura

O backend utiliza uma organização em camadas para separar responsabilidades:

- **Routes:** definição dos endpoints da aplicação.
- **Controllers:** tratamento das requisições e respostas HTTP.
- **Services:** implementação das regras de negócio.
- **Repositories:** comunicação com o banco de dados.

Essa organização busca facilitar a manutenção, os testes e a evolução do sistema.

## Instalação e execução

### Pré-requisitos

Antes de começar, é necessário ter instalado:

- Node.js
- npm
- Git
- Acesso a um banco PostgreSQL.

Para utilizar os recursos de mensageria, também será necessário configurar o RabbitMQ.

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Acessar a pasta do projeto

```bash
cd blog_tecnologia
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do backend.

Configure as variáveis necessárias para:

- Conexão com o banco de dados.
- Chave secreta de autenticação JWT.
- Credenciais do Cloudinary.
- Configurações adicionais utilizadas pelos serviços da aplicação.

Os nomes das variáveis devem corresponder aos utilizados no código.

**Importante:** nunca compartilhe credenciais reais, tokens ou chaves secretas. O arquivo `.env` não deve ser enviado ao GitHub.

### 5. Gerar o Prisma Client

```bash
npx prisma generate
```

As migrações e a preparação do banco devem seguir o fluxo de configuração do Prisma utilizado no projeto.

### 6. Iniciar o servidor

Para iniciar a API:

```bash
npm start
```

Esse comando executa:

```bash
node server.js
```

### 7. Executar os serviços de mensageria

O projeto também possui scripts para iniciar o publicador e o consumer:

```bash
npm run publicador
```

```bash
npm run consumer
```

Para iniciar a API, o publicador e o consumer simultaneamente:

```bash
npm run dev:mensageria
```

Esse modo requer que as configurações e os serviços externos necessários, incluindo o RabbitMQ, estejam disponíveis.

## Segurança

O projeto utiliza mecanismos voltados à proteção da aplicação, incluindo:

- Autenticação baseada em JWT.
- Criptografia de senhas com bcrypt.
- Validação de dados com Zod.
- Controle de autorização para operações protegidas.
- Tratamento centralizado de erros.
- Registro de eventos e erros com Winston.
- Limitação de requisições (Rate Limiting).
- Cuidados com a renderização de conteúdo fornecido pelos usuários.

A segurança continua sendo avaliada durante o processo de homologação.

## Arquitetura da aplicação

O projeto utiliza uma arquitetura organizada em camadas, separando as responsabilidades da aplicação.

### Inicialização

- `server.js`: inicializa o servidor HTTP, integra o Socket.IO e configura o monitoramento com New Relic.
- `app.js`: configura o Express, registra middlewares, disponibiliza arquivos estáticos e registra as rotas.

### Comunicação em tempo real

O projeto utiliza Socket.IO para comunicação em tempo real, permitindo a transmissão de eventos relacionados a comentários entre os clientes conectados.

### Organização do backend

- Routes: definição dos endpoints.
- Controllers: gerenciamento das requisições e respostas HTTP.
- Services: regras de negócio.
- Repositories: acesso e persistência dos dados.
- Middleware: autenticação, autorização e tratamento de erros.
- Validators: validação dos dados recebidos.

## Status do projeto

**Em desenvolvimento.**

O DevBlog está passando por uma etapa de testes, homologação e aprimoramento de funcionalidades, com atenção especial à segurança, estabilidade e experiência do usuário.

## Autor

Desenvolvido por **Bruno Melo de Morais**.

GitHub: [BrunoMeloMorais22](https://github.com/BrunoMeloMorais22)