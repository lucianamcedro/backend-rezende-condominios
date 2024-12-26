# Projeto Backend

```markdown


Este é um projeto de backend desenvolvido com Node.js e Express, que oferece uma API RESTful para gerenciar usuários e visitantes em um sistema. O projeto utiliza o Firebase para funcionalidades de autenticação e armazenamento de dados.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework web para Node.js.
- **Firebase**: Serviço de backend para autenticação e armazenamento.
- **CORS**: Middleware para permitir requisições de diferentes origens.
- **Body-parser**: Middleware para análise do corpo das requisições.

## Instalação

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/lucianamcedro/backend-rezende/tree/main
   cd backend-rezende
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure o Firebase**: Certifique-se de ter um projeto Firebase configurado e adicione suas credenciais no arquivo `firebaseConfig.js`.

4. **Inicie o servidor**:

   ```bash
   npm start
   ```

   O servidor será iniciado na porta `3000` ou na porta definida na variável de ambiente `PORT`.

## Endpoints da API

### Usuários

- **Registrar Usuário**
  - `POST /api/register`
  - **Body**: `{ "nome": "string", "cpf": "string", "senha": "string", ... }`
  - **Resposta**: 200 OK, `{ "mensagem": "Usuário registrado com sucesso" }`

- **Login**
  - `POST /api/login`
  - **Body**: `{ "cpf": "string", "senha": "string" }`
  - **Resposta**: 200 OK, `{ "token": "string" }`

- **Obter Usuário**
  - `GET /api/user/:cpf`
  - **Resposta**: 200 OK, `{ "nome": "string", "cpf": "string", ... }`

- **Atualizar Usuário**
  - `PUT /api/user/:cpf`
  - **Body**: `{ "nome": "string", ... }`
  - **Resposta**: 200 OK, `{ "mensagem": "Usuário atualizado com sucesso" }`

- **Deletar Usuário**
  - `DELETE /api/user/:cpf`
  - **Resposta**: 200 OK, `{ "mensagem": "Usuário deletado com sucesso" }`

### Visitantes

- **Registrar Visitante**
  - `POST /api/visitor`
  - **Body**: `{ "nome": "string", "documento": "string", ... }`
  - **Resposta**: 200 OK, `{ "mensagem": "Visitante registrado com sucesso" }`

- **Obter Visitante**
  - `GET /api/visitor/:visitorId`
  - **Resposta**: 200 OK, `{ "nome": "string", "documento": "string", ... }`

- **Atualizar Visitante**
  - `PUT /api/visitor/:visitorId`
  - **Body**: `{ "nome": "string", ... }`
  - **Resposta**: 200 OK, `{ "mensagem": "Visitante atualizado com sucesso" }`

- **Deletar Visitante**
  - `DELETE /api/visitor/:visitorId`
  - **Resposta**: 200 OK, `{ "mensagem": "Visitante deletado com sucesso" }`

## Contribuição

Sinta-se à vontade para contribuir com este projeto. Faça um fork do repositório e crie uma nova branch para suas modificações. Envie um pull request para discutir suas alterações.

## Licença

Este projeto está sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Se você tiver alguma dúvida, sinta-se à vontade para entrar em contato:

- **Email**: luciana_cedro@hotmail.com
- **LinkedIn**: [seulinkedin]([https://www.linkedin.com/in/seulinkedin](https://www.linkedin.com/in/lucianamcedro/))
```

### Explicação dos componentes do README:
1. **Título e Descrição**: Fornece uma visão geral do projeto.
2. **Tecnologias Utilizadas**: Lista as tecnologias e ferramentas usadas no projeto.
3. **Instalação**: Passos detalhados para configurar e executar o projeto localmente.
4. **Endpoints da API**: Documentação dos endpoints disponíveis, incluindo métodos HTTP, parâmetros e exemplos de resposta.
5. **Contribuição**: Instruções sobre como contribuir para o projeto.
6. **Licença**: Informações sobre a licença do projeto.
7. **Contato**: Informações de contato para dúvidas ou feedback.
