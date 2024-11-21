import { useState, useEffect } from "react";
import NewExcercise from "./NewExcercise";

export default function Excercises({
  muscle,
  visible,
  onClose,
  selectExcercise,
  children,
  muscleGroups,
  workoutId
}) {
  const [excercises, setExcercises] = useState([]);
  const [newShown, setNewShown] = useState(false);

  // Handle overlay clicks to close the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Fetch exercises when the `muscle` prop changes
  useEffect(() => {
    if (!muscle) return; // Avoid fetching if `muscle` is undefined/null
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/excercises/${muscle}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setExcercises(data || []);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
      });
  }, [muscle]);

  // Debugging: Log exercises
  console.log(excercises);

  // Render the modal content
  return (
    <>
      {visible && (
        <div
          className="fixed inset-0 flex items-center justify-center z-40"
          onClick={handleOverlayClick}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Modal Content */}
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative z-10">
            {newShown ? (
              <NewExcercise
                onClose={() => setNewShown(false)}
                muscleGroups={muscleGroups}
                workoutId={workoutId}
              />
            ) : (
              <>
                {children}
                <h2 className="text-xl mb-4">Exercises</h2>
                <div className="space-y-2">
                  {excercises?.map((excercise) => (
                    <div
                      key={excercise.id}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={(e) => selectExcercise(e, excercise.name)}
                      >
                        {excercise.name}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="w-full flex justify-between mt-4">
                  <button
                    className="p-2 bg-blue-500 text-white rounded"
                    onClick={() => setNewShown(true)}
                  >
                    New +
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 bg-gray-500 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
