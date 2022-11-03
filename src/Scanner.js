import React, { useEffect } from 'react';
import "./scanner.css"
import DWT from './DynamsoftSDK';

function Scanner(props) {



  return (
    <div className="App">
      <DWT
        setBack={props.setBack}
        setUserData={props.setUserData}
        features={[
          "scan",
          "camera",
          "load",
          "save",
          "upload",
          "barcode",
          "ocr",
          "uploader"
        ]}
      />
    </div>
  )
}

export default Scanner;
