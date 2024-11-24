"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  PlusCircleIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";

export default function ProgramTemplates({ setProgram, onNext }) {
  const [programTemplates, setProgramTemplates] = useState([]);
  const [expandedProgramId, setExpandedProgramId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program/template`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProgramTemplates(data);
        setIsLoading(false);
        console.log('PROGRAMS: ', data);
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
        setIsLoading(false);
      });
      
  }, []);

  const onSelect = (id) => {
    const selectedProgram = programTemplates.find(
      (program) => program.id === id
    );
    setProgram(selectedProgram);
    console.log('SELECTED PROGRAM: ', selectedProgram);
    onNext(2);
  };

  const toggleSummary = (programId) => {
    setExpandedProgramId((prev) => (prev === programId ? null : programId));
  };

  return (
    <div className="flex flex-col w-full space-y-4 p-4 sm:max-w-screen-sm sm:mx-auto">
      <h2 className="text-left text-2xl sm:text-3xl">JFIT Templates</h2>

      {isLoading ? (
        <>
        <Skeleton height={100} width="100%" />
        <Skeleton height={100} width="100%" />
        <Skeleton height={100} width="100%" />
        </>

      ) : (

        programTemplates.map((program) => (
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
              <div className="flex flex-col space-y-2 items-center">
                <button
                  onClick={() => onSelect(program.id)}
                  className="text-black p-2 rounded hover:bg-gray-200"
                >
                  <PlusCircleIcon className="h-8 w-8 text-gray-600 hover:text-gray-800 transition duration-300" />
                </button>
                <button
                  onClick={() => toggleSummary(program.id)}
                  className="text-black p-2 rounded hover:bg-gray-200"
                >
                  {expandedProgramId === program.id ? (
                    <ChevronUpIcon className="h-6 w-6 text-gray-600 transition-all duration-300" />
                  ) : (
                    <ChevronUpIcon className="h-6 w-6 text-gray-600 transition-all duration-300 rotate-180" />
                  )}
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
        ))

      )}

      {/* Render message if no templates are found */}
      {programTemplates.length === 0 && !isLoading && (
        <p className="text-gray-500">No JFIT templates could be found.</p>
      )}
    </div>
  );
}