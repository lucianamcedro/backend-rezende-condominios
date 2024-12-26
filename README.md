# Sistema de Gerenciamento de Usuários e Visitantes

Este projeto é um sistema de gerenciamento de usuários e visitantes para condomínios, permitindo registrar, autenticar e gerenciar informações de usuários e visitantes, além de gerar códigos QR para facilitar o acesso.

## Tecnologias Utilizadas

- Node.js
- Express
- Firebase
- bcryptjs (para hash de senhas)
- QRCode (para geração de QR Codes)

## Funcionalidades

- Registro de usuários
- Login de usuários
- Obtenção, atualização e deleção de informações de usuários
- Registro de visitantes
- Obtenção, atualização e deleção de informações de visitantes
- Geração de códigos QR para usuários e visitantes

## Pré-requisitos

- Node.js
- Firebase CLI
- Conta no Firebase para configuração do banco de dados

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seuusuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o Firebase:
   - Crie um projeto no Firebase.
   - No console do Firebase, crie as coleções `users` e `visitors`.
   - Configure as credenciais do Firebase no arquivo `config/firebaseConfig.js`.

4. Execute o servidor:
   ```bash
   npm start
   ```

# API de Cadastro de Usuários e Visitantes

## Endpoints

### 1. **Registrar Usuário**

**POST** `/api/register`

**Descrição**: Registra um novo usuário no sistema.

**Body**:
```json
{
  "nome": "string",
  "cpf": "string",
  "senha": "string",
  "endereco": "string",
  "modeloCarro": "string",
  "placaCarro": "string",
  "diasDentroCondominio": "number",
  "apartamento": "string"
}
```

**Resposta**:
```json
{
  "mensagem": "Usuário registrado com sucesso",
  "qrCodeUrl": "string"
}
```

### 2. **Login**

**POST** `/api/login`

**Descrição**: Realiza o login do usuário.

**Body**:
```json
{
  "cpf": "string",
  "senha": "string"
}
```

**Resposta**:
```json
{
  "token": "string"
}
```

### 3. **Obter Usuário**

**GET** `/api/user/:cpf`

**Descrição**: Recupera os dados de um usuário pelo CPF.

**Resposta**:
```json
{
  "nome": "string",
  "cpf": "string",
  "endereco": "string",
  "modeloCarro": "string",
  "placaCarro": "string",
  "diasDentroCondominio": "number",
  "apartamento": "string",
  "qrCodeUrl": "string"
}
```

### 4. **Atualizar Usuário**

**PUT** `/api/user/:cpf`

**Descrição**: Atualiza os dados de um usuário.

**Body**:
```json
{
  "nome": "string",
  "endereco": "string",
  "modeloCarro": "string",
  "placaCarro": "string",
  "diasDentroCondominio": "number",
  "apartamento": "string"
}
```

**Resposta**:
```json
{
  "mensagem": "Usuário atualizado com sucesso"
}
```

### 5. **Deletar Usuário**

**DELETE** `/api/user/:cpf`

**Descrição**: Deleta um usuário do sistema.

**Resposta**:
```json
{
  "mensagem": "Usuário deletado com sucesso"
}
```

---

### 6. **Registrar Visitante**

**POST** `/api/visitor`

**Descrição**: Registra um visitante no sistema.

**Body**:
```json
{
  "nome": "string",
  "documento": "string",
  "placa": "string",
  "quantidadeDias": "number",
  "dataEntrada": "string (formato ISO 8601)",
  "nomeProprietario": "string",
  "apartamento": "string",
  "telefone": "string",
  "observacao": "string"
}
```

**Resposta**:
```json
{
  "mensagem": "Visitante registrado com sucesso",
  "visitorId": "string",
  "qrCodeUrl": "string"
}
```

### 7. **Obter Visitante**

**GET** `/api/visitor/:visitorId`

**Descrição**: Recupera os dados de um visitante pelo ID.

**Resposta**:
```json
{
  "nome": "string",
  "documento": "string",
  "placa": "string",
  "quantidadeDias": "number",
  "dataEntrada": "string (formato ISO 8601)",
  "nomeProprietario": "string",
  "apartamento": "string",
  "telefone": "string",
  "observacao": "string",
  "qrCodeUrl": "string"
}
```

### 8. **Atualizar Visitante**

**PUT** `/api/visitor/:visitorId`

**Descrição**: Atualiza os dados de um visitante.

**Body**:
```json
{
  "nome": "string",
  "documento": "string",
  "placa": "string",
  "quantidadeDias": "number",
  "dataEntrada": "string (formato ISO 8601)",
  "nomeProprietario": "string",
  "apartamento": "string",
  "telefone": "string",
  "observacao": "string"
}
```

**Resposta**:
```json
{
  "mensagem": "Visitante atualizado com sucesso"
}
```

### 9. **Deletar Visitante**

**DELETE** `/api/visitor/:visitorId`

**Descrição**: Deleta um visitante do sistema.

**Resposta**:
```json
{
  "mensagem": "Visitante deletado com sucesso"
}
```

---

## Contribuição

Sinta-se à vontade para enviar pull requests ou abrir issues para melhorias e correções.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
