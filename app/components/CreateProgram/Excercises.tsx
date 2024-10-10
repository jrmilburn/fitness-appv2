import { useState, useEffect } from 'react';

export default function Excercises({ muscle, visible, onClose, selectExcercise}) {

    const [excercises, setExcercises] = useState([]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      };

      useEffect(() => {
        fetch(`http://localhost:3000/api/excercises/${muscle}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setExcercises(data || []);
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      }, []);

      console.log(excercises);

    return (
        <>
            {visible && (
              <div 
                className="fixed inset-0 flex items-center justify-center z-50" 
                onClick={handleOverlayClick}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
                {/* Modal Content */}
                <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative z-10">
                  <h2 className="text-xl mb-4">Excercises</h2>

                    {excercises?.map((excercise) => (
                        <div key={excercise.id} className="flex items-center justify-between border-b py-2">
                            <button onClick={(e) => selectExcercise(e, excercise.name)}>{excercise.name}</button>
                        </div>
                    ))}

                  <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Close
                  </button>
                </div>
              </div>
            )}
        </>
    )

}