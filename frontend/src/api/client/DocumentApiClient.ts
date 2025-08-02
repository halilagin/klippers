import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
    Document
} from '@/api/models/Document';

import {Signer} from '@/api/models/Signer';
import {SigningSession} from '@/api/models/SigningSession';
import {SignatureAudit, SignatureAuditFromJSON} from '@/api/models/SignatureAudit';


import {PDFFile} from "../models/PDFFile"
import * as crypto from 'crypto';  // Add this import at the top of the file
import { SignatureInPDF, SignatureInPDFFromJSON } from '../models';

const generateUUID = (): string => {
    if (typeof window === 'undefined') {
        // Node.js environment
        const { randomUUID } = require('crypto');
        return randomUUID();
    } else {
        // Browser environment
        return window.crypto.randomUUID();
    }
};

export class DocumentApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async createDocument(
    // pdfFile: Blob, 
    title: string, 
    createdBy: string, 
    status: string
  ): Promise<any> {
    

    const data = JSON.stringify({
      title,
      created_by: createdBy,
      status
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await this.client.post('/api/v1/documents/', data, config);
    return response.data;
  }

  

  async addPdfFile(
    documentId: string, 
    fileData: string, 
    fileSize: number, 
    md5Hash: string
  ): Promise<{ message: string }> {

    const data = JSON.stringify({
      id: generateUUID(),
      document_id: documentId,
      file_data_base64: fileData,
      file_size: fileSize,
      md5_hash: md5Hash,
      uploaded_at: new Date()
    });

    console.log('addPdfFile.data', data);
    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
    };

    const response = await this.client.post(
      `/api/v1/documents/${documentId}/pdf`,
      data,
      config
    );
    return response.data;
  }

  async updateDocument(
    documentId: string, 
    status: string, 
    metaData: { key: string; tags: string[] }
  ): Promise<Document> {
    const response = await this.client.post(
      `/api/v1/documents/${documentId}`,
      { status, meta_data: metaData }
    );
    return response.data;
  }

  async getDocument(documentId: string): Promise<Document> {
    const response = await this.client.get(`/api/v1/documents/${documentId}`);
    return response.data;
  }

  /*
  
@router.get("/docs_with_pdf_ids/{document_id}", response_model=schema_user.MessageResponse,
            summary="Get document",
            description="Retrieve a document by its ID")
def get_document_with_pdf_ids(
    document_id: str = Path(..., des
  */


  async getDocumentWithSignatures(documentId: string, signerId: string): Promise<any> {
    const response = await this.client.get(`/api/v1/documents/docs_with_pdf_and_signatures/${documentId}/${signerId}`);
    const document =  response.data["message"]["document"] as Document
    const signaturePerPdfId = response.data["message"]["signature_schema_per_pdf"] as Record<string, SignatureInPDF[]>
    const mymap: Record<string, SignatureInPDF[]> = {}
    Object.keys(signaturePerPdfId).forEach((key) => {
        mymap[key] = signaturePerPdfId[key].map((signature) => SignatureInPDFFromJSON(signature))
    })
    return {document, signaturePerPdfId: mymap};
  }

  async getDocumentPdfFiles(documentId: string): Promise<PDFFile[]> {
    const response = await this.client.get(
      `/api/v1/documents/${documentId}/pdf-files`
    );
    return response.data;
  }

  async getPublicDocumentPdfFiles(documentId: string): Promise<PDFFile[]> {
    const response = await this.client.get(
      `/api/v1/documents/public/pdf-files/${documentId}`
    );
    return response.data;
  }

  async getSignedDocumentPdfFile(documentId: string): Promise<any> {
    const response = await this.client.get(
      `/api/v1/documents/public/signed-pdf-file/${documentId}`
    );
    return response.data;
  }


  async createSigner(
    documentId: string, 
    email: string, 
    name: string, 
    order: number
  ): Promise<Signer> {
    const response = await this.client.post(
      `/api/v1/documents/${documentId}/signers`,
      { email, name, order }
    );
    return response.data;
  }

  async createSignatureInPdf(
    pdfFileId: string,
    signerId: string,
    placement: {
      page: number;
      x: number;
      y: number;
      width: number;
      height: number;
      signature_image_base64: string;
      sign_type: string;
    }
  ): Promise<any> {
    const response = await this.client.post(
      `/api/v1/documents/pdf-files/${pdfFileId}/signatures`,
      { signer_id: signerId, ...placement }
    );
    return response.data;
  }


  /*
   
async def create_signatures_in_pdf(
    pdf_file_ids: List[str] = Body(..., description="ID of the PDF file"),
    signer_id: str = Body(..., description="ID of the signer"),
    pages: List[int] = Body(..., description="Page number where signature should be placed"),
    xs: List[float] = Body(..., description="X coordinate of signature placement"),
    ys: List[float] = Body(..., description="Y coordinate of signature placement"),
    widths: List[float] = Body(..., description="Width of signature area"),
    heights: List[float] = Body(..., description="Height of signature area"),
    signature_image_base64s: List[str] = Body(None, description="Base64 encoded signature image (optional)"),
    db: Session = Depends(get_db)
):
  */
  async updateAllSignaturesInPdfWithSigned(
      documentId: string,
      signerId: string,
      ids: string[],
      signature_image_base64s: string[]
    ): Promise<any> {
    const response = await this.client.post(
      `/api/v1/documents/pdf-files/update-all-signatures-with-signed/${documentId}/${signerId}`,
      { ids, signature_image_base64s }
    );
    return response;
  }

  async getSignatureInPdfBySignerId(
    signerId: string
  ): Promise<SignatureInPDF[]> {
    const response = await this.client.get(
        
      `/api/v1/documents/signatures-by-signer-id/${signerId}`
    );
    return response.data;
  }


  async createSigningSession(
    documentId: string,
    signerEmail: string,
    expiresInDays = 7
  ): Promise<SigningSession> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const response = await this.client.post(
      `/api/v1/documents/${documentId}/signing-sessions`,
      {
        expires_at: expiresAt.toISOString(),
        status: 'ACTIVE',
        signer_email: signerEmail
      }
    );
    return response.data;
  }

  async updateSigningSession(
    sessionId: string,
    status: string,
    completedAt: string
  ): Promise<SigningSession> {
    const response = await this.client.put(
      `/api/v1/documents/signing-sessions/${sessionId}`,
      { status, completed_at: completedAt }
    );
    return response.data;
  }

  async createSignatureAudit(
    documentId: string,
    signerId: string,
    data: {
      signer_email: string;
      signer_name: string;
      action: string;
      ip_address: string;
      user_agent: string;
    }
  ): Promise<SignatureAudit> {
    const response = await this.client.post(
      `/api/v1/documents/${documentId}/signature-audits`,
      { signer_id: signerId, ...data }
    );
    return response.data;
  }

  async getSignatureAudits(documentId: string): Promise<SignatureAudit[]> {
    const response = await this.client.get(
      `/api/v1/documents/${documentId}/signature-audits`
    );
    return response.data;
  }

  async checkAllSigned(documentId: string): Promise<{ all_signed: boolean }> {
    const response = await this.client.get(
      `/api/v1/documents/${documentId}/check-all-signed`
    );
    return response.data;
  }

  async getUserDocuments(): Promise<Document[]> {
    const response = await this.client.post('/api/v1/documents/list/my-documents');
    return response.data;
  }
} 