import { db } from '../config/firebaseConfig';
import { generateQRCode } from '../utils/qrCodeUtils';  


export class VisitorService {
    static async register(visitorData: any) {
        const { nome, placa, quantidadeDias, dataEntrada, nomeProprietario, apartamento, telefone, observacao } = visitorData;

        if (!nome || !placa || !quantidadeDias || !dataEntrada || !nomeProprietario || !apartamento || !telefone) {
            throw new Error('Todos os campos são obrigatórios');
        }

        const visitorId = db.collection('visitors').doc().id;

        const newVisitor = {
            nome,
            placa,
            quantidadeDias,
            dataEntrada,
            nomeProprietario,
            apartamento,
            telefone,
            observacao
        };

        await db.collection('visitors').doc(visitorId).set(newVisitor);
        const qrCodeUrl = await generateQRCode({ visitorId });

        await db.collection('visitors').doc(visitorId).update({ qrCodeUrl });

        return { message: 'Visitante registrado com sucesso', visitorId, qrCodeUrl };
    }

    static async getVisitor(visitorId: string) {
        const visitorDoc = await db.collection('visitors').doc(visitorId).get();
        if (!visitorDoc.exists) {
            throw new Error('Visitante não encontrado');
        }

        return visitorDoc.data();
    }

    static async updateVisitor(visitorId: string, updateData: any) {
        const visitorDoc = await db.collection('visitors').doc(visitorId).get();
        if (!visitorDoc.exists) {
            throw new Error('Visitante não encontrado');
        }

        await db.collection('visitors').doc(visitorId).update(updateData);
        return 'Dados do visitante atualizados com sucesso';
    }

    static async deleteVisitor(visitorId: string) {
        const visitorDoc = await db.collection('visitors').doc(visitorId).get();
        if (!visitorDoc.exists) {
            throw new Error('Visitante não encontrado');
        }

        await db.collection('visitors').doc(visitorId).delete();
        return 'Visitante deletado com sucesso';
    }
}
