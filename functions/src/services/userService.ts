import { db } from '../config/firebaseConfig';
import bcrypt from 'bcryptjs';
import { generateQRCode } from '../utils/qrCodeUtils';

export class UserService {
    static async register(userData: any) {
        const { cpf, password, nome, endereco, modeloCarro, placaCarro, diasDentroCondominio, apartamento } = userData;

        if (!cpf || !password || !nome) {
            throw new Error('Nome, CPF e senha são obrigatórios');
        }

        const existingUser = await db.collection('users').doc(cpf).get();
        if (existingUser.exists) {
            throw new Error('CPF já registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            cpf,
            password: hashedPassword,
            nome,
            endereco,
            modeloCarro,
            placaCarro,
            diasDentroCondominio,
            apartamento,
        };

        await db.collection('users').doc(cpf).set(newUser);
        const qrCodeUrl = await generateQRCode({ cpf });

        await db.collection('users').doc(cpf).update({ qrCodeUrl });

        return { message: 'Usuário registrado com sucesso', qrCodeUrl };
    }

    static async login(credentials: any) {
        const { cpf, password } = credentials;

        const userDoc = await db.collection('users').doc(cpf).get();
        if (!userDoc.exists) {
            throw new Error('Usuário não encontrado');
        }

        const userData = userDoc.data();
        const isPasswordValid = await bcrypt.compare(password, userData?.password);
        if (!isPasswordValid) {
            throw new Error('Senha incorreta');
        }

        return { message: 'Login bem-sucedido' };
    }

    static async getUser(cpf: string) {
        const userDoc = await db.collection('users').doc(cpf).get();
        if (!userDoc.exists) {
            throw new Error('Usuário não encontrado');
        }

        return userDoc.data();
    }

    static async updateUser(cpf: string, updateData: any) {
        const userDoc = await db.collection('users').doc(cpf).get();
        if (!userDoc.exists) {
            throw new Error('Usuário não encontrado');
        }

        await db.collection('users').doc(cpf).update(updateData);
        return 'Dados do usuário atualizados com sucesso';
    }

    static async deleteUser(cpf: string) {
        const userDoc = await db.collection('users').doc(cpf).get();
        if (!userDoc.exists) {
            throw new Error('Usuário não encontrado');
        }

        await db.collection('users').doc(cpf).delete();
        return 'Usuário deletado com sucesso';
    }
}
