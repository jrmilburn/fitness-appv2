import { useState } from "react";
import Link from "next/link";

export default function CoachPrograms({ programs, onClose, clientId }) {
  const [expandedProgramId, setExpandedProgramId] = useState(null);

  const toggleSummary = (programId) => {
    setExpandedProgramId((prev) => (prev === programId ? null : programId));
  };

  const handleClickOutside = (event) => {
    if (event.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-primary-text bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div className="bg-background max-w-3xl w-full max-h-[90%] overflow-y-auto rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary-text hover:text-black"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="flex flex-col space-y-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-background-secondary p-4 rounded flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-primary-text">{program.name}</h2>
                  <p className="text-sm text-secondary-text">
                    {program.length} Weeks - {program.days} Days / Week
                  </p>
                  <p className="text-sm text-secondary-text">
                    Created: {new Date(program.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 text-primary-text">
                  <Link href={`/programs/assign/${program.id}/${clientId}`}>
                    <button className="text-primary-text px-4 py-2 rounded hover:bg-highlight">
                      Assign Program
                    </button>
                  </Link>
                  <button
                    onClick={() => toggleSummary(program.id)}
                    className="text-primary-text px-4 py-2 rounded hover:bg-highlight"
                  >
                    {expandedProgramId === program.id
                      ? "Hide Summary"
                      : "View Summary"}
                  </button>
                </div>
              </div>

              {/* Summary Dropdown */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedProgramId === program.id
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="bg-white p-4 rounded shadow-inner mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {program.name} - Weekly Summary
                  </h3>
                  {program.weeks[0]?.workouts?.length > 0 ? (
                    <div className="space-y-4">
                      {program.weeks[0].workouts.map((workout) => (
                        <div
                          key={workout.id}
                          className="bg-gray-100 p-4 rounded shadow-sm"
                        >
                          <h4 className="text-md font-bold">{workout.name}</h4>
                          <ul className="list-disc pl-5 mt-2">
                            {workout.excercises.map((excercise) => (
                              <li key={excercise.id}>
                                {excercise.name} (
                                {excercise.muscleGroup.name})
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No workouts found for Week 1.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}