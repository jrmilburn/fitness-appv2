"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PreviousPrograms({ setProgram, onNext }) {
  const [previousPrograms, setPreviousPrograms] = useState([]);
  const [expandedProgramId, setExpandedProgramId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setPreviousPrograms(data));
  }, []);

  const onSelect = (id) => {
    const selectedProgram = previousPrograms.find(
      (program) => program.id === id
    );
    setProgram(selectedProgram);
    onNext();
  };

  const toggleSummary = (programId) => {
    setExpandedProgramId((prev) => (prev === programId ? null : programId));
  };

  return (
    <div className="flex flex-col max-w-2xl w-full mx-auto space-y-4 pt-8">
      <h2 className="text-left text-3xl">Select from previous programs</h2>
      {previousPrograms.map((program) => (
        <div
          key={program.id}
          className={`w-full bg-gray-100 p-4 rounded shadow-md`}
        >
          <div className="w-full flex justify-between items-start">
            <div>
            <Link href={`/programs/${program.id}`}>
              <h2 className="text-xl font-bold">{program.name}</h2>
              </Link>

              <p className="text-sm opacity-50">
                {program.length} Weeks - {program.days} Days / Week
              </p>
              <p className="text-sm opacity-50">
                Created: {new Date(program.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
            <button
                onClick={() => onSelect(program.id)}
                className="text-black p-2 rounded hover:bg-blue-600"
              >
                Select Program
              </button>
              <button
                onClick={() => toggleSummary(program.id)}
                className="text-black p-2 rounded hover:bg-gray-200"
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
                            {excercise.name} ({excercise.muscleGroup.name})
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
  );
}