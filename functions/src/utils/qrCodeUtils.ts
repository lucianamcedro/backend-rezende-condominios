import QRCode from 'qrcode';

export const generateQRCode = async (data: any): Promise<string> => {
    try {
        const qrCodeData = await QRCode.toDataURL(JSON.stringify(data));
        return qrCodeData;
    } catch (error) {
        throw new Error('Erro ao gerar o QR Code');
    }
};
