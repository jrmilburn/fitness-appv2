"use client";

import { useState, useEffect } from "react";

export default function Musclegroups({ visible, onClose, onAdd, muscleGroups, setMuscleGroups }) {


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      };

        useEffect(() => {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/musclegroups`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setMuscleGroups(data || []);
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
          }, []);

    return (
        <>
        {visible && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50" 
            onClick={handleOverlayClick}
          >
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
  
            {/* Modal Content */}
            <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative z-10">
              <h2 className="text-xl mb-4">Muscle Groups</h2>
              {muscleGroups?.map((muscleGroup) => (
                <div key={muscleGroup.id} className="flex items-center justify-between border-b py-2">
                  <button onClick={() => onAdd(muscleGroup)}>{muscleGroup.name}</button>
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