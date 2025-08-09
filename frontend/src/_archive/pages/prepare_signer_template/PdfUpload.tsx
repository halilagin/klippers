import React from 'react';
import DocumentUpload from './DocumentUpload';

interface Props {
  // Define your props here
}

const PdfUpload: React.FC<Props> = () => {
  return (
    <div>
      <DocumentUpload />
    </div>
  );
};

export default PdfUpload;
