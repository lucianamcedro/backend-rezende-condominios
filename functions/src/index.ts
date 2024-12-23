import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import bodyParser from 'body-parser';
import qrcode from 'qrcode';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import cors from 'cors'; 

const serviceAccountPath = path.join(__dirname, '../backend-condominio-rezende-firebase-adminsdk-mipbm-9b0f2a4350.json');

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Arquivo de credenciais não encontrado: ${serviceAccountPath}`);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://us-central1-backend-condominio-rezende.cloudfunctions.net'
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Rota de registro de usuário
app.post('/register', async (req: express.Request, res: express.Response) => {
  const { cpf, password, nome, endereco, modeloCarro, placaCarro, diasDentroCondominio, apartamento } = req.body;

  if (!cpf || !password || !nome) {
    return res.status(400).send('Nome, CPF e senha são obrigatórios');
  }

  try {
    const existingUser = await db.collection('users').doc(cpf).get();
    if (existingUser.exists) {
      return res.status(400).send('CPF já registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: any = {
      cpf,
      password: hashedPassword,
      nome,
    };

    if (endereco) userData.endereco = endereco;
    if (modeloCarro) userData.modeloCarro = modeloCarro;
    if (placaCarro) userData.placaCarro = placaCarro;
    if (diasDentroCondominio) userData.diasDentroCondominio = diasDentroCondominio;
    if (apartamento) userData.apartamento = apartamento;

    await db.collection('users').doc(cpf).set(userData);
    const qrCodeData = JSON.stringify({ cpf });
    const qrCodeUrl = await qrcode.toDataURL(qrCodeData);

    await db.collection('users').doc(cpf).update({
      qrCodeUrl
    });

    res.status(200).send({ message: 'Usuário registrado com sucesso', qrCodeUrl });
  } catch (error) {
    const err = error as Error;
    res.status(500).send('Erro ao registrar usuário: ' + err.message);
  }
});

// Rota de login
app.post('/login', async (req: express.Request, res: express.Response) => {
  const { cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).send('CPF e senha são obrigatórios');
  }

  try {
    const userDoc = await db.collection('users').doc(cpf).get();

    if (!userDoc.exists) {
      return res.status(404).send('Usuário não encontrado');
    }

    const userData = userDoc.data();
    if (!userData || !(await bcrypt.compare(password, userData.password))) {
      return res.status(401).send('Senha incorreta');
    }

    res.status(200).send('Login bem-sucedido');
  } catch (error) {
    const err = error as Error;
    res.status(500).send('Erro ao fazer login: ' + err.message);
  }
});

// Rota para ler dados do usuário pelo CPF
app.get('/user/:cpf', async (req: express.Request, res: express.Response) => {
    const { cpf } = req.params;

    try {
      const userDoc = await db.collection('users').doc(cpf).get();

      if (!userDoc.exists) {
        return res.status(404).send('Usuário não encontrado');
      }

      const userData = userDoc.data();
      if (userData) {
        res.status(200).json({
          cpf: userData.cpf,
          nome: userData.nome,
          endereco: userData.endereco,
          modeloCarro: userData.modeloCarro,
          placaCarro: userData.placaCarro,
          diasDentroCondominio: userData.diasDentroCondominio,
          apartamento: userData.apartamento,
          qrCodeUrl: userData.qrCodeUrl 
        });
      } else {
        res.status(404).send('Usuário não encontrado');
      }
    } catch (error) {
      const err = error as Error;
      res.status(500).send('Erro ao recuperar dados do usuário: ' + err.message);
    }
});

// Rota para atualizar dados do usuário
app.put('/user/:cpf', async (req: express.Request, res: express.Response) => {
    const { cpf } = req.params;
    const { nome, endereco, modeloCarro, placaCarro, diasDentroCondominio, apartamento, password } = req.body;

    try {
        const userDoc = await db.collection('users').doc(cpf).get();

        if (!userDoc.exists) {
            return res.status(404).send('Usuário não encontrado');
        }

        const updateData: any = {};

        if (nome) updateData.nome = nome;
        if (endereco) updateData.endereco = endereco;
        if (modeloCarro) updateData.modeloCarro = modeloCarro;
        if (placaCarro) updateData.placaCarro = placaCarro;
        if (diasDentroCondominio) updateData.diasDentroCondominio = diasDentroCondominio;
        if (apartamento) updateData.apartamento = apartamento;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await db.collection('users').doc(cpf).update(updateData);

        res.status(200).send('Dados do usuário atualizados com sucesso');
    } catch (error) {
        const err = error as Error;
        res.status(500).send('Erro ao atualizar dados do usuário: ' + err.message);
    }
});

// Rota para deletar um usuário
app.delete('/user/:cpf', async (req: express.Request, res: express.Response) => {
    const { cpf } = req.params;

    try {
        const userDoc = await db.collection('users').doc(cpf).get();

        if (!userDoc.exists) {
            return res.status(404).send('Usuário não encontrado');
        }

        await db.collection('users').doc(cpf).delete();

        res.status(200).send('Usuário deletado com sucesso');
    } catch (error) {
        const err = error as Error;
        res.status(500).send('Erro ao deletar usuário: ' + err.message);
    }
});

// Rota para registrar um visitante
app.post('/visitor', async (req: express.Request, res: express.Response) => {
  const { nome, placa, quantidadeDias, dataEntrada, nomeProprietario, apartamento, telefone, observacao } = req.body;

  if (!nome || !placa || !quantidadeDias || !dataEntrada || !nomeProprietario || !apartamento || !telefone) {
      return res.status(400).send('Todos os campos são obrigatórios');
  }

  try {

      const visitorId = admin.firestore().collection('visitors').doc().id;
      await db.collection('visitors').doc(visitorId).set({
          nome,
          placa,
          quantidadeDias,
          dataEntrada,
          nomeProprietario,
          apartamento,
          telefone,
          observacao
      });
 
      const qrCodeData = JSON.stringify({ visitorId });
      const qrCodeUrl = await qrcode.toDataURL(qrCodeData);

      await db.collection('visitors').doc(visitorId).update({
          qrCodeUrl
      });

      res.status(200).send({ message: 'Visitante registrado com sucesso', visitorId, qrCodeUrl });
  } catch (error) {
      const err = error as Error;
      res.status(500).send('Erro ao registrar visitante: ' + err.message);
  }
});

// Rota para ler dados do visitante pelo ID
app.get('/visitor/:visitorId', async (req: express.Request, res: express.Response) => {
  const { visitorId } = req.params;

  try {
      const visitorDoc = await db.collection('visitors').doc(visitorId).get();

      if (!visitorDoc.exists) {
          return res.status(404).send('Visitante não encontrado');
      }

      const visitorData = visitorDoc.data();
      if (visitorData) {
          res.status(200).json({
              nome: visitorData.nome,
              placa: visitorData.placa,
              quantidadeDias: visitorData.quantidadeDias,
              dataEntrada: visitorData.dataEntrada,
              nomeProprietario: visitorData.nomeProprietario,
              apartamento: visitorData.apartamento,
              telefone: visitorData.telefone,
              observacao: visitorData.observacao,
              qrCodeUrl: visitorData.qrCodeUrl
          });
      } else {
          res.status(404).send('Visitante não encontrado');
      }
  } catch (error) {
      const err = error as Error;
      res.status(500).send('Erro ao recuperar dados do visitante: ' + err.message);
  }
});


// Rota para atualizar dados do visitante
app.put('/visitor/:visitorId', async (req: express.Request, res: express.Response) => {
  const { visitorId } = req.params;
  const { nome, placa, quantidadeDias, dataEntrada, nomeProprietario, apartamento, telefone, observacao } = req.body;

  try {
      const visitorDoc = await db.collection('visitors').doc(visitorId).get();

      if (!visitorDoc.exists) {
          return res.status(404).send('Visitante não encontrado');
      }

      const updateData: any = {};

      if (nome) updateData.nome = nome;
      if (placa) updateData.placa = placa;
      if (quantidadeDias) updateData.quantidadeDias = quantidadeDias;
      if (dataEntrada) updateData.dataEntrada = dataEntrada;
      if (nomeProprietario) updateData.nomeProprietario = nomeProprietario;
      if (apartamento) updateData.apartamento = apartamento;
      if (telefone) updateData.telefone = telefone;
      if (observacao) updateData.observacao = observacao;

      await db.collection('visitors').doc(visitorId).update(updateData);

      res.status(200).send('Dados do visitante atualizados com sucesso');
  } catch (error) {
      const err = error as Error;
      res.status(500).send('Erro ao atualizar dados do visitante: ' + err.message);
  }
});

// Rota para deletar um visitante
app.delete('/visitor/:visitorId', async (req: express.Request, res: express.Response) => {
  const { visitorId } = req.params;

  try {
      const visitorDoc = await db.collection('visitors').doc(visitorId).get();

      if (!visitorDoc.exists) {
          return res.status(404).send('Visitante não encontrado');
      }

      await db.collection('visitors').doc(visitorId).delete();

      res.status(200).send('Visitante deletado com sucesso');
  } catch (error) {
      const err = error as Error;
      res.status(500).send('Erro ao deletar visitante: ' + err.message);
  }
});

app.get('/check-qrcode', async (req: express.Request, res: express.Response) => {
  const { qrCode } = req.query;

  if (!qrCode) {
    return res.status(400).send('QR Code é obrigatório');
  }

  try {

    const qrCodeBase64 = qrCode as string;
    const qrCodeData = Buffer.from(qrCodeBase64.split(',')[1], 'base64').toString('utf-8');

    const userSnapshot = await db.collection('users').where('qrCodeUrl', '==', qrCodeBase64).get();
    if (!userSnapshot.empty) {
      const user = userSnapshot.docs[0].data();
      return res.status(200).json({ type: 'user', data: user });
    }

    const visitorSnapshot = await db.collection('visitors').where('qrCodeUrl', '==', qrCodeBase64).get();
    if (!visitorSnapshot.empty) {
      const visitor = visitorSnapshot.docs[0].data();
      return res.status(200).json({ type: 'visitor', data: visitor });
    }

    res.status(404).send('QR Code não encontrado');
  } catch (error) {
    const err = error as Error;
    res.status(500).send('Erro ao verificar QR Code: ' + err.message);
}
});
app.get('/users', async (req: express.Request, res: express.Response) => {
  try {
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      return res.status(404).send('Nenhum usuário encontrado');
    }

    const users: any[] = [];

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        cpf: userData.cpf,
        nome: userData.nome,
        endereco: userData.endereco,
        modeloCarro: userData.modeloCarro,
        placaCarro: userData.placaCarro,
        diasDentroCondominio: userData.diasDentroCondominio,
        apartamento: userData.apartamento,
        qrCodeUrl: userData.qrCodeUrl
      });
    });

    res.status(200).json(users);
  } catch (error) {
    const err = error as Error;
    res.status(500).send('Erro ao listar usuários: ' + err.message);
  }
});
exports.registerUser = functions.https.onRequest(app);
