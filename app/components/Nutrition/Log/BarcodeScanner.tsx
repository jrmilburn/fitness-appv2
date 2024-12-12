// components/BarcodeScanner.js

import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected, onError }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            target: scannerRef.current,
            constraints: {
              facingMode: 'environment', // Use the back camera
            },
          },
          decoder: {
            readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'code_39_reader'],
          },
        },
        (err) => {
          if (err) {
            console.error(err);
            onError(err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected(handleDetected);

      return () => {
        Quagga.offDetected(handleDetected);
        Quagga.stop();
      };
    }
  }, [isScanning]);

  const handleDetected = (data) => {
    if (data && data.codeResult && data.codeResult.code) {
      onDetected(data.codeResult.code);
      setIsScanning(false); // Stop scanning after detection
    }
  };

  return (
    <div>
      {!isScanning && (
        <button
          onClick={() => setIsScanning(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Scan Barcode
        </button>
      )}
      {isScanning && (
        <div className="mt-4">
          <div
            ref={scannerRef}
            className="w-full h-64 border-2 border-dashed border-gray-300"
          >
            {/* Camera Stream will appear here */}
          </div>
          <button
            onClick={() => setIsScanning(false)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Stop Scanning
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;