import  {Signer, SignerFromJSON, SignerFromJSONTyped, SignerToJSON, SignerToJSONTyped }  from '@/api/models/Signer';

const signerInfo: Signer[] = [];
const signatureImage="data:image/png;base64,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";

signerInfo.push({
    documentId: '1234567890',
    id: 'berfinagin',
    name: 'Berfin Agin',
    email: 'berfin.aginn@gmail.com',
    signatureFields: [
        {
            page: 1,
            signatureImage : signatureImage,
            x : 325,
            y : 464,
            signType: 'signature',
            signerId: "berfinagin",
            id: 'berfinagin',
            width: 200,
            height: 100,
            pdfFileId: '1234567890',
            createdAt: new Date(),
            uploadedAt: new Date(),
            signed: false
        }
    ]
}

); 


signerInfo.push({
    documentId: '1234567890',
    id: 'halilagin',
    name: 'Halil Agin',
    email: 'halil.agin@gmail.com',
    signatureFields: [
        {
            page: 2,
            signatureImage : signatureImage,
            x : 412,
            y : 204,
            signType: 'signature',
            signerId: "halilagin",
            id: 'halilagin',
            width: 200,
            height: 100,
            pdfFileId: '1234567890',
            createdAt: new Date(),
            uploadedAt: new Date(),
            signed: false
        }
    ]
}

); 





export default signerInfo;


