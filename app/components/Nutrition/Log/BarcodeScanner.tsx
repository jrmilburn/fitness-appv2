"use client";

import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeScanner = ({ onDetected, onError, onStop }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleUpdate = (err, result) => {
    if (isLoading) {
      setIsLoading(false); // Scanner is ready
    }

    if (result) {
      onDetected(result.text);
      if (onStop) onStop(); // Inform parent to stop scanning
    } else if (err) {
      onError(err);
    }
  };

  return (
    <div
      className="
        fixed top-16 bottom-24 left-0 right-0 w-full
        border-2 border-dashed border-gray-300
        overflow-hidden

        sm:relative sm:top-auto sm:bottom-auto sm:left-auto sm:right-auto
        sm:mx-auto sm:my-16
        sm:max-w-md sm:h-64
      "
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <p className="text-primary-text">Initializing camera...</p>
        </div>
      )}
      <BarcodeScannerComponent
        onUpdate={handleUpdate}
        height={'100%'}
        width={"100%"}
      />
      <button
        onClick={() => {
          if (onStop) onStop(); // Inform parent to stop scanning
        }}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded absolute bottom-2 right-2 z-10"
        aria-label="Stop Scanning"
      >
        Stop Scanning
      </button>
    </div>
  );
};

export default BarcodeScanner;
