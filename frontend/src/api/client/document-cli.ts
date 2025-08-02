import { PDFFileBase64FromJSON } from '../models';
import { AuthApiClient } from './AuthApiClient';
import { DocumentApiClient } from './DocumentApiClient';
import * as crypto from 'crypto';
import { createCanvas } from 'canvas';
import { 
    Document as AppDocument
} from '@/api/models/Document';
import AppConfig from '@/AppConfig';

const imageData = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  // PNG header
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,  // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,  // 1x1 pixel
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,  // bit depth, color type
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,  // IDAT chunk
    0x54, 0x08, 0x99, 0x02, 0x01, 0x00, 0x00, 0x00,  // pixel data
    0xFF, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,  // IEND chunk
    0x42, 0x60, 0x82
]);

const getCanvas = (width: number, height: number) => {
    if (typeof window === 'undefined') {
        // Node.js environment
        return createCanvas(width, height);
    } else {
        // Browser environment
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
};

export function createSignatureImageBlob(): Promise<Blob> {
    return new Promise((resolve) => {
        const canvas = getCanvas(200, 50);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        if (!ctx) throw new Error('Could not get canvas context');
        
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Signature', 10, 35);
        
        if (typeof window === 'undefined') {
            // Node.js environment
            const nodeCanvas = canvas as import('canvas').Canvas;
            const buffer = nodeCanvas.toBuffer('image/png');
            resolve(new Blob([buffer], { type: 'image/png' }));
        } else {
            // Browser environment
            const browserCanvas = canvas as HTMLCanvasElement;
            browserCanvas.toBlob((blob: Blob | null) => {
                if (!blob) throw new Error('Could not create blob');
                resolve(blob);
            }, 'image/png');
        }
    });
}

function cleanBase64String(base64String: string): string {
    // Remove data URI prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    
    // Remove any whitespace, newlines or carriage returns
    return base64Data.replace(/[\n\r\s]/g, '');
}

export async function createSignatureImageBase64(): Promise<string> {
    const base64String = await blobToBase64(await createSignatureImageBlob());
    
    // Clean and validate the string
    const cleanedBase64 = cleanBase64String(base64String);
    if (!isValidBase64(cleanedBase64)) {
        throw new Error('Invalid base64 string');
    }
    
    return cleanedBase64;
}

async function listDocuments(client: DocumentApiClient) {
    const documents = await client.getUserDocuments();
    console.log('Documents:', JSON.stringify(documents, null, 2));
}


async function createDocument(client: DocumentApiClient) {
    // const binaryData = new Uint8Array([72, 101, 108, 108, 111]);
    // const blob = new Blob([binaryData], { type: 'application/pdf' });
    const createdDocument = await client.createDocument(
        // blob,
        'Test Document',
        'user123',
        'draft'
    );
    console.log('Document:', JSON.stringify(createdDocument, null, 2));
    let doc = {
        id: createdDocument["message"]
    } as AppDocument
    return doc; //message is the document id
}

async function addPdfFile(client: DocumentApiClient) {
    const document = await createDocument(client);
    const binaryData = new Uint8Array([72, 101, 108, 108, 111]);
    const blob = new Blob([binaryData], { type: 'application/pdf' });
    const base64Data = await blobToBase64(blob);
    const fileSize = blob.size;
    const md5Hash = await calculateMD5Hash(blob);
    const addedPDFFile = await client.addPdfFile(
        document.id,
        base64Data,
        fileSize,
        md5Hash
    );
    console.log('addedPDFFile:', JSON.stringify(addedPDFFile, null, 2));
    return {"document_id": document.id, "pdf_file_id": addedPDFFile["message"]};
}


async function addPdfFileToDocument(client: DocumentApiClient, documentId: string, binaryData: Uint8Array) {
    const blob = new Blob([binaryData], { type: 'application/pdf' });
    const base64Data = await blobToBase64(blob);
    const fileSize = blob.size;
    const md5Hash = await calculateMD5Hash(blob);
    const addedPDFFile = await client.addPdfFile(
        documentId,
        base64Data,
        fileSize,
        md5Hash
    );
    // console.log('addedPDFFile:', JSON.stringify(addedPDFFile, null, 2));
    return {"pdf_file_id": addedPDFFile["message"]};
}



function isValidBase64(str: string): boolean {
    // Check if string exists and is not empty
    if (!str || str.trim() === '') {
        console.error('Base64 string is empty or undefined');
        return false;
    }

    // Check if the string matches base64 pattern
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(str)) {
        console.error('Base64 string contains invalid characters');
        return false;
    }

    // Check if length is valid (multiple of 4)
    if (str.length % 4 !== 0) {
        console.error('Base64 string length is not a multiple of 4');
        return false;
    }

    try {
        // Try to decode it using browser's atob
        const decoded = atob(str);
        // Try to encode it back using browser's btoa
        const encoded = btoa(decoded);
        // Check if we get the same string back
        if (encoded !== str) {
            console.error('Base64 string failed encode/decode test');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error validating base64:', error);
        return false;
    }
}


export const blobToBase64 = async (blob: Blob): Promise<string> => {
    if (typeof window === 'undefined') {
        // Node.js environment
        const buffer = Buffer.from(await blob.arrayBuffer());
        return buffer.toString('base64');
    } else {
        // Browser environment
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
};

const generateHash = async (arrayBuffer: ArrayBuffer): Promise<Uint8Array> => {
    if (typeof window === 'undefined') {
        // Node.js environment
        const { createHash } = await import('crypto');
        const hash = createHash('sha256');
        hash.update(Buffer.from(arrayBuffer));
        return new Uint8Array(hash.digest());
    } else {
        // Browser environment
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
        return new Uint8Array(hashBuffer);
    }
};

export async function calculateMD5Hash(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const hashArray = Array.from(await generateHash(arrayBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


async function updateDocument(client: DocumentApiClient) {
    const update_data = {
        "status": "active",
        "meta_data": {"key": "value", "tags": ["important", "contract"]}
    }
    const document = await createDocument(client);
    const updatedDocument = await client.updateDocument(
        document.id,
        update_data["status"],
        update_data["meta_data"]
    );
    console.log('updatedDocument:', JSON.stringify(updatedDocument, null, 2));
}


async function getDocument(client: DocumentApiClient) {
    
    const document = await createDocument(client);
    const fetcheddDocument = await client.getDocument(
        document.id,
    );
    console.log('fetcheddDocument:', JSON.stringify(fetcheddDocument, null, 2));
}

async function getDocumentPDFFiles(client: DocumentApiClient) {
    const addedPDFFile = await addPdfFile(client);
    const fetchedDocumentPDfFiles = await client.getDocumentPdfFiles(
        addedPDFFile["document_id"],
    );
    console.log('fetchedDocumentPDfFiles:', JSON.stringify(fetchedDocumentPDfFiles, null, 2));
}

async function createSigner(client: DocumentApiClient) {
    const addedPDFFile = await addPdfFile(client);
    const signer = await client.createSigner(
        addedPDFFile["document_id"],
        "admin@example.com",
        "Test Signer",
        1
    );
    console.log('signer:', JSON.stringify(signer, null, 2));
    // return signer;
    return {...addedPDFFile, "signer_id": signer["id"]};
}


async function createSignatureInPdf(client: DocumentApiClient) {
    const addedSigner = await createSigner(client);

    // const signatureImageBase64 = await createSignatureImageBase64();
    // console.log('signatureImageBase64:', signatureImageBase64);
    // console.log(await createSignatureImageBase64())

    const signature = await client.createSignatureInPdf(
        addedSigner["pdf_file_id"],
        addedSigner["signer_id"],
        {
            page: 1,
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            signature_image_base64: await createSignatureImageBase64(),
            sign_type: "signature"  
        }
    );
    console.log('signature:', JSON.stringify(signature, null, 2));
    // return signer;
    return {...addedSigner, "signature_id": signature["message"]};
}


async function createSigningSession(client: DocumentApiClient) {
    const addedSigner = await createSigner(client);

    const result = await client.createSigningSession(
        addedSigner["document_id"],
        "admin@example.com",
        7
    );
    console.log('signing session:', JSON.stringify(result, null, 2));
    // return signer;
    return {...addedSigner, "signing_session_d": result["id"]};
}


async function updateSigningSession(client: DocumentApiClient) {
    const addedPDFFile = await addPdfFile(client);

    const signingSession = await client.createSigningSession(
        addedPDFFile["document_id"],
        "admin@example.com",
        7
    );

    const completed_at = new Date();
    const update_data = {
        "status": "COMPLETED",
        "completed_at": completed_at
    }
    const updatedSession = await client.updateSigningSession(
        signingSession["id"],
        update_data["status"],
        update_data["completed_at"].toISOString()
    );

    console.log('updated signing session:', JSON.stringify(updatedSession, null, 2));
    // return signer;
    return {...addedPDFFile, "signing_session_d": signingSession["id"]};
}


async function createSignatureAudit(client: DocumentApiClient) {
    const addedSigner = await createSigner(client);

    // Create signature audit
    const audit_data = {
        "signer_id": addedSigner["signer_id"],
        "signer_email": "signer@example.com",
        "signer_name": "Test Signer",
        "action": "VIEWED",
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    const signatureAudit = await client.createSignatureAudit(
        addedSigner["document_id"],
        addedSigner["signer_id"],
        audit_data
    );

    console.log('signatureAudit :', JSON.stringify(signatureAudit, null, 2));
    // return signer;
    return {...addedSigner, "signature_audit_id": signatureAudit["id"]};
}

async function getSignatureAudits(client: DocumentApiClient) {
    const signatureAudit = await createSignatureAudit(client);
    const fetchedSignatureAudit = await client.getSignatureAudits(
        signatureAudit["document_id"]
    );

    console.log('fetchedSignatureAudit :', JSON.stringify(fetchedSignatureAudit, null, 2));
}

async function checkAllSigned(client: DocumentApiClient) {
    const signatureAudit = await createSignatureAudit(client);
    const allSigned = await client.checkAllSigned(
        signatureAudit["document_id"]
    );
    console.log('allSigned :', JSON.stringify(allSigned, null, 2));
    return allSigned;
}



async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const baseUrl = AppConfig.baseApiUrl || 'http://127.0.0.1:8000';
    const authClient = new AuthApiClient();

    const authToken = await authClient.login('admin@example.com', 'admin123');
    
    const docClient = new DocumentApiClient(baseUrl, authToken.accessToken);
    
    try {
        switch (command) {
            case 'list':
                await listDocuments(docClient);
                break;
            case 'get':
                await getDocument(docClient);
                break;
            case 'create':
                await createDocument(docClient);
                break;
            case 'add-pdf':
                await addPdfFile(docClient);
                break;
            case 'update-document':
                await updateDocument(docClient);
                break;
            case 'get-pdf-files':
                await getDocumentPDFFiles(docClient);
                break;
            case 'create-signer':
                await createSigner(docClient);
                break;
            case 'create-signature-in-pdf':
                await createSignatureInPdf(docClient);
                break;
            case 'create-signing-session':
                await createSigningSession(docClient);
                break;
            case 'update-signing-session':
                await updateSigningSession(docClient);
                break;
            case 'create-signature-audit':
                await createSignatureAudit(docClient);
                break;
            case 'get-signature-audits':
                await getSignatureAudits(docClient);
                break;
            case 'check-all-signed':
                await checkAllSigned(docClient);
                break;
            case "all":
                await listDocuments(docClient);
                await getDocument(docClient);
                await createDocument(docClient);
                await addPdfFile(docClient);
                await updateDocument(docClient);
                await getDocumentPDFFiles(docClient);
                await createSigner(docClient);
                await createSignatureInPdf(docClient);
                await createSigningSession(docClient);
                await updateSigningSession(docClient);
                await createSignatureAudit(docClient);
                await getSignatureAudits(docClient);
                await checkAllSigned(docClient);
                console.log('all done');
                break;
                
            default:
                console.log('Unknown command. Available commands: list, get <documentId>');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// main(); 