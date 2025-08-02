import { SignatureInPDF } from '@/api/models/SignatureInPDF';
import { SignatureInPDFToJSON } from '@/api/models/SignatureInPDF';
import useCreateSignTemplateState from '../prepare_signer_template/state/CreateSignTemplateState';
import { useEffect, useState } from 'react';
import SignerPane from '../../components/SignerPane';
import InitialPane from '../../components/InitialPane';
import DatePane from '../../components/DatePane';
import TextPane from '../../components/TextPane'; 
import TitlePane from '../../components/TitlePane';
import NamePane from '../../components/NamePane';

interface SignFieldProps {  
    item: {
      id: string;
      x: number;
      y: number;
      signType: string;
      signed: boolean;
    };
    
    clickHandler?: (item: any) => void;
  }


const SignFieldSignedComponent: React.FC<SignFieldProps> = ({ item }) => {
    const createSignTemplateState = useCreateSignTemplateState();
    const[signatureImage, setSignatureImage] = useState<string | null>(null);

    useEffect(() => {
        let signaturePerPdfId = JSON.parse(JSON.stringify(createSignTemplateState.signaturePerPdfId));
        let key = Object.keys(signaturePerPdfId || {})[0]
        const signatureFields = signaturePerPdfId[key] as SignatureInPDF[];
        
        const signatureData = signatureFields.find(
            field => field.id === item.id
        )?.signatureImage;
        setSignatureImage(signatureData? signatureData : null);
        
    }, []);

    // Check if the signature data is an image (base64) or text
    const isImageData = signatureImage && signatureImage.startsWith('data:image');

    // Adjust position to account for centering offset applied during drag and drop
    const adjustedX = item.x + 40; // itemWidth / 2 = 80 / 2 = 40
    const adjustedY = item.y + 20; // itemHeight / 2 = 40 / 2 = 20

    return (
      <div
        key={item.id}
        style={{
          position: 'absolute',
          left: adjustedX,
          top: adjustedY,
          padding: 0,
          backgroundColor: 'transparent',
          cursor: 'move',
          pointerEvents: 'auto',
          zIndex: 1,
          transition: 'all 0.2s ease',
          minWidth: '60px',
          textAlign: 'center'
        }}
      >
        {signatureImage && isImageData ? (
          <img 
            src={signatureImage} 
            alt="Signature" 
            style={{
              maxWidth: '150px',
              height: 'auto'
            }}
          />
        ) : signatureImage ? (
          <div style={{
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#000000'
          }}>
            {signatureImage}
          </div>
        ) : null}
      </div>
    );
};

const SignFieldUnsignedComponent: React.FC<SignFieldProps> = ({ item, clickHandler }) => {
    const createSignTemplateState = useCreateSignTemplateState();
    const [showSignerPane, setShowSignerPane] = useState(false);
    const [signerId, setSignerId] = useState<string | null>(null);
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const signerIdParam = searchParams.get('signerId');
        setSignerId(signerIdParam || "");
    }, []);

    // Adjust position to account for centering offset applied during drag and drop
    const adjustedX = item.x + 40; // itemWidth / 2 = 80 / 2 = 40
    const adjustedY = item.y + 20; // itemHeight / 2 = 40 / 2 = 20

    const signFinished = (signatureData: string) => {
        // Find and update the signature field in the state
        let signaturePerPdfId = JSON.parse(JSON.stringify(createSignTemplateState.signaturePerPdfId));
        let key = Object.keys(signaturePerPdfId || {})[0]
        const signatureFields = signaturePerPdfId[key] as SignatureInPDF[];
        const updatedFields = signatureFields.map((field: SignatureInPDF) => {
            if (field.id === item.id) {
                return {
                    ...field,
                    signed: true,
                    signType: item.signType,
                    signatureImage: signatureData
                };
            }
            return field;
        });
        signaturePerPdfId[key] = updatedFields;
        createSignTemplateState.setSignaturePerPdfId(signaturePerPdfId);
        setShowSignerPane(false);
    };

    return (
      <>
        <div
          key={item.id}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSignerPane(true);
            clickHandler?.(item);
          }}
          style={{
            position: 'absolute',
            left: adjustedX,
            top: adjustedY,
            padding: '8px 12px',
            backgroundColor: '#fff3e0',
            border: '1px solid #ff9800',
            borderRadius: '4px',
            cursor: 'move',
            pointerEvents: 'auto',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex:  1,
            transition: 'all 0.2s ease',
            minWidth: '60px',
            textAlign: 'center'
          }}
        >
          {item.signType}
        </div>
        {showSignerPane && item.signType.toLowerCase() == "signature" && (
          <SignerPane
            position={{ x: item.x, y: item.y }}
            onClose={() => setShowSignerPane(false)}
            onSave={(signatureData) => signFinished(signatureData)}
            pageNumber={1}
          />
        )}

        {showSignerPane && item.signType.toLowerCase() == "initial" && (
          <InitialPane
            position={{ x: item.x, y: item.y }}
            onClose={() => setShowSignerPane(false)}
            onSave={(signatureData) => signFinished(signatureData)}
            pageNumber={1}
          />
        )}

        {showSignerPane && item.signType.toLowerCase() == "date" && (
          <DatePane
            position={{ x: item.x, y: item.y }}
            onClose={() => setShowSignerPane(false)}
            onSave={(signatureData) => signFinished(signatureData)}
            pageNumber={1}
          />  
        )}  

        {showSignerPane && item.signType.toLowerCase() == "text" && (
          <TextPane
            position={{ x: item.x, y: item.y }}
            onClose={() => setShowSignerPane(false)}
            onSave={(signatureData) => signFinished(signatureData)} 
            pageNumber={1}  
          />

        )}

        {showSignerPane && item.signType.toLowerCase() == "title" && (
          <TitlePane
            position={{ x: item.x, y: item.y }}
            onClose={() => setShowSignerPane(false)}
            onSave={(signatureData) => signFinished(signatureData)}
            pageNumber={1}
          />
        )}

        {showSignerPane && item.signType.toLowerCase() == "name" && (
          <NamePane
            position={{ x: item.x, y: item.y }}
            onClose={() => setShowSignerPane(false)}
            onSave={(signatureData) => signFinished(signatureData)}
            pageNumber={1}
            />
          )}
  
      </> 
    );
  };
  
  export const SignFieldComponent: React.FC<SignFieldProps> = ({ item, clickHandler }) => {
    const createSignTemplateState = useCreateSignTemplateState();
    const [isSigned, setIsSigned] = useState(false);
    
    useEffect(() => {
        setIsSigned((Object.values(createSignTemplateState.signaturePerPdfId || {})[0] || [])
        .find(signature => signature.id === item.id)?.signed || false);
    }, [createSignTemplateState.signaturePerPdfId]);

    return (
        isSigned ? <SignFieldSignedComponent item={item} /> : <SignFieldUnsignedComponent item={item} clickHandler={clickHandler} />
    );
  };