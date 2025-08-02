import React, { useState, useEffect } from 'react';
import './BerfinTest.css'; // You'll need to create this CSS file
import { AuthApiClient } from '@/api/client/AuthApiClient';
import PrepareSignerTemplateMain from './prepare_signer_template/PrepareSignerTemplateMain';
import TestStatePage from './teststate/TestStatePage';
import SignedPdfView from './SignedPdfView';
import DebugSignedPdfView from './DebugSignedPdfView';


const LoginTest = () => {

    const [token, setToken] = useState(null);
    const [tokenType, setTokenType] = useState(null);

    const handleLogin = () => {
        const token = new AuthApiClient().login('admin@example.com', 'admin123')
        .then(response => {
            console.log('response', response);
        });
        // const token = localStorage.getItem('access_token');
        // const tokenType = localStorage.getItem('token_type');
        // setToken(token);
        // setTokenType(tokenType);
        // console.log('token', token);
    }


  return (
    <div>
      <h1>Login Test</h1>
      <button onClick={()=> {handleLogin()}}>Get Token</button>
    </div>
  );
}


const CreateDocumentTest = () => {

    const [token, setToken] = useState(null);
    const [tokenType, setTokenType] = useState(null);

    const handle = () => {
        const token = new AuthApiClient().login('admin@example.com', 'admin123')
        .then(response => {
            console.log('response', response);
        });
        // const token = localStorage.getItem('access_token');
        // const tokenType = localStorage.getItem('token_type');
        // setToken(token);
        // setTokenType(tokenType);
        // console.log('token', token);
    }


  return (
    <div>
      <h1>Login Test</h1>
      <button onClick={()=> {handle()}}>Create Document</button>
    </div>
  );
}


const TabTest = () => {
    // Individual state for each form element
    const [activeIndex, setActiveIndex] = useState(0);
  
    //<section style={{ display: activeIndex === 0 ? 'block' : 'none' }}>
    
  const showTab = (index: number) => {
      return  index === activeIndex ? 'block' : 'none';
  }
  
  const showTabStyle = (index: number) => {
      return  index === activeIndex ? {border: '1px solid #ddd', borderBottom: 'none', background: '#f50000'} : {};
  }
  
    return (
      <>
          <div className="tab-container">
          <div className="tabs">
              <ul>
              <li style={showTabStyle(0)}><label htmlFor="tab0" onClick={() => setActiveIndex(0)}>Tab 0</label></li>
              <li style={showTabStyle(1)}><label htmlFor="ta1" onClick={() => setActiveIndex(1)}>Tab 1</label></li>
              <li style={showTabStyle(2)}><label htmlFor="tab2" onClick={() => setActiveIndex(2)}>Tab 2</label></li>
              </ul>
              
              <div className="content">
              <section style={{display: showTab(0)}}>
                  <h2>Tab 0 Content</h2>
                  <p>This is the content for tab 0.</p>
              </section>
              <section style={{display: showTab(1)}}>
                  <h2>Tab 1 Content</h2>
                  <p>This is the content for tab 1.</p>
              </section>
              <section style={{display: showTab(2)}}>
                  <h2>Tab 2 Content</h2>
                  <p>This is the content for tab 2.</p>
              </section>
              </div>
          </div>
          </div>
      </>
    );
  }; 

const BerfinTest = () => {
  // Individual state for each form element
  const [activeIndex, setActiveIndex] = useState(0);

  //<section style={{ display: activeIndex === 0 ? 'block' : 'none' }}>
  
const showTab = (index: number) => {
    return  index === activeIndex ? 'block' : 'none';
}

const showTabStyle = (index: number) => {
    return  index === activeIndex ? {border: '1px solid #ddd', borderBottom: 'none', background: '#f50000'} : {};
}

  return (
    <>
        {/* <TabTest />
        <LoginTest />
        <CreateDocumentTest /> */}
        <PrepareSignerTemplateMain />
        {/* <TestStatePage  /> */}
        {/* <DebugSignedPdfView /> */}
    </>
  );
}; 

export default BerfinTest;
