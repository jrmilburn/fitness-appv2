"use client";

import { useState, useEffect } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
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
    <div className="flex flex-col w-full sm:max-w-screen-sm sm:mx-auto">
      <h2 className="text-left text-2xl sm:text-3xl text-primary-text p-2 pb-4">
        JFIT Templates
      </h2>
  
      {isLoading ? (
        <>
          <Skeleton height={100} width="100%" />
          <Skeleton height={100} width="100%" />
          <Skeleton height={100} width="100%" />
        </>
      ) : (
        programTemplates.map((program) => {
          return (
            <div
              key={program.id}
              className="w-full bg-background-secondary p-4 rounded border-b-2 border-border shadow-md hover:bg-background cursor-pointer"
              onClick={() => onSelect(program.id)}
            >
              <div className="w-full flex justify-between items-start">
                <div>
                  <h2 className="text-xl inter-bold text-primary-text">
                    {program.name}
                  </h2>
                  <p className="text-sm text-secondary-text">
                    {program.length} Weeks - {program.days} Days / Week
                  </p>
                  <p className="text-sm text-secondary-text">
                    Created: {new Date(program.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col justify-center h-full space-y-2 items-center">
                  <button
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent the click from reaching parent div
                      toggleSummary(program.id);
                    }}
                    className="text-primary-text p-2 rounded"
                  >
                    {expandedProgramId === program.id ? (
                      <ChevronUpIcon className="h-6 w-6 text-primary-text hover:text-secondary-text transition-all duration-300" />
                    ) : (
                      <ChevronUpIcon className="h-6 w-6 text-primary-text hover:text-secondary-text transition-all duration-300 rotate-180" />
                    )}
                  </button>
                </div>
              </div>
  
              {/* Summary Dropdown */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedProgramId === program.id
                    ? "opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="bg-background p-4 rounded shadow-inner mt-4">
                  <h3 className="text-lg inter-bold mb-2 text-primary-text">
                    {program.name} - Weekly Summary
                  </h3>
                  {program.weeks[0]?.workouts?.length > 0 ? (
                    <div className="space-y-4">
                      {program.weeks[0].workouts.map((workout) => (
                        <div
                          key={workout.id}
                          className="bg-background-secondary p-4 rounded shadow-sm"
                        >
                          <h4 className="text-md inter-bold text-primary-text">
                            {workout.name}
                          </h4>
                          <ul className="list-disc pl-5 mt-2">
                            {workout.excercises.map((excercise) => (
                              <li key={excercise.id} className="text-primary-text">
                                {excercise.name}{" "}
                                <span className="text-secondary-text">
                                  ({excercise.muscleGroup.name})
                                </span>
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
                  <p className="text-secondary-text">{program.notes}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
  
      {/* Render message if no templates are found */}
      {programTemplates.length === 0 && !isLoading && (
        <p className="text-gray-500">No JFIT templates could be found.</p>
      )}
    </div>
  );
}  