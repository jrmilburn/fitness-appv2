"use client";

import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected, onError, onLoadingChange }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // If we are scanning, initialize Quagga
    if (isScanning) {
      onLoadingChange(true); // Inform parent that we are loading/initializing

      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            target: scannerRef.current,
            constraints: {
              facingMode: 'environment',
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
            setIsScanning(false);
            onLoadingChange(false);
            return;
          }
          Quagga.start();
          onLoadingChange(false);
        }
      );

      Quagga.onDetected(handleDetected);

      return () => {
        Quagga.offDetected(handleDetected);
        Quagga.stop();
      };
    }
  }, [isScanning, onError, onLoadingChange]);

  const handleDetected = (data) => {
    if (data && data.codeResult && data.codeResult.code) {
      onDetected(data.codeResult.code);
      setIsScanning(false); // stop scanning once detected
    }
  };

  return (
    <div className="w-full relative">
      {!isScanning && (
        <button
          onClick={() => setIsScanning(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Start Scanning
        </button>
      )}
      {isScanning && (
        <div className="relative w-full h-64 border-2 border-dashed border-gray-300 overflow-hidden">
          <div ref={scannerRef} className="w-full h-full relative">
            {/* Animated scanning line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 animate-scan-line"></div>
          </div>
          <button
            onClick={() => setIsScanning(false)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded absolute bottom-2 right-2 z-10"
          >
            Stop Scanning
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;