"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const bcrypt = __importStar(require("bcryptjs"));
const serviceAccount = require('../backend-condominio-rezende-firebase-adminsdk-mipbm-9b0f2a4350.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://backend-condominio-rezende-default-rtdb.firebaseio.com'
});
const db = admin.firestore();
const app = (0, express_1.default)();
app.use(bodyParser.json());
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf, password, nome, endereco, modeloCarro, placaCarro, diasDentroCondominio, apartamento } = req.body;
    if (!cpf || !password || !nome || !endereco || !modeloCarro || !placaCarro || !diasDentroCondominio || !apartamento) {
        return res.status(400).send('Todos os campos são obrigatórios');
    }
    const hashedPassword = yield bcrypt.hash(password, 10);
    try {
        yield db.collection('users').doc(cpf).set({
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
    }
    catch (error) {
        const err = error;
        res.status(500).send('Erro ao registrar usuário: ' + err.message);
    }
}));
exports.registerUser = functions.https.onRequest(app);