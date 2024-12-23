import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

const serviceAccountPath = path.join(__dirname, '../backend-condominio-rezende-firebase-adminsdk-mipbm-9b0f2a4350.json');
if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Arquivo de credenciais não encontrado: ${serviceAccountPath}`);
}

const serviceAccount = require(serviceAccountPath);

export const initializeApp = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://us-central1-backend-condominio-rezende.cloudfunctions.net',
    });
};

export const db = admin.firestore();
