import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import * as bodyParser from 'body-parser';
import * as qrcode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcryptjs';

// Verifique se o arquivo JSON existe
const serviceAccountPath = path.join(__dirname, '../backend-condominio-rezende-firebase-adminsdk-mipbm-9b0f2a4350.json');

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Arquivo de credenciais não encontrado: ${serviceAccountPath}`);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://backend-condominio-rezende-default-rtdb.firebaseio.com'
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());

// Rota de registro de usuário
app.post('/register', async (req: express.Request, res: express.Response) => {
  const { cpf, password, nome, endereco, modeloCarro, placaCarro, diasDentroCondominio, apartamento } = req.body;

  if (!cpf || !password || !nome || !endereco || !modeloCarro || !placaCarro || !diasDentroCondominio || !apartamento) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.collection('users').doc(cpf).set({
      cpf,
      password: hashedPassword,
      nome,
      endereco,
      modeloCarro,
      placaCarro,
      diasDentroCondominio,
      apartamento
    });

    // Gerar QR Code
    const qrCodeData = JSON.stringify({ cpf });
    const qrCodeUrl = await qrcode.toDataURL(qrCodeData);

    // Armazenar QR Code no Firestore
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
  
  
// Rota de cadastro de visitante
app.post('/visitor', async (req: express.Request, res: express.Response) => {
    const { nome, placa, quantidadeDias, dataEntrada, nomeProprietario, apartamento, telefone, observacao } = req.body;
  
    if (!nome || !placa || !quantidadeDias || !dataEntrada || !nomeProprietario || !apartamento || !telefone) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }
  
    try {
      // Gerar ID único para o visitante
      const visitorId = admin.firestore().collection('visitors').doc().id;
  
      // Armazenar dados do visitante
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
  
      // Gerar QR Code com ID do visitante
      const qrCodeData = JSON.stringify({ visitorId });
      const qrCodeUrl = await qrcode.toDataURL(qrCodeData);
  
      // Armazenar QR Code no Firestore
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

exports.registerUser = functions.https.onRequest(app);
