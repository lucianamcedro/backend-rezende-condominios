import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import * as bodyParser from 'body-parser';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as fs from 'fs';

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
    res.status(200).send('Usuário registrado com sucesso');
  } catch (error) {
    const err = error as Error;
    res.status(500).send('Erro ao registrar usuário: ' + err.message);
  }
});


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

exports.registerUser = functions.https.onRequest(app);
