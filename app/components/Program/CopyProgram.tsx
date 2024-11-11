'use client';

import { useState, useEffect } from 'react';
import ProgramExcercises from "../CreateProgram/Programexcercises";

export default function CopyProgram({ program }) {
    const [copyProgram, setCopyProgram] = useState(null);

    useEffect(() => {
        function createProgram(programName, programLength, programDays) {
            const newProgram = {
                name: programName,
                length: programLength,
                days: programDays,
                weeks: []
            };

            // Loop through each week in the original program (if it exists)
            for (let i = 0; i < programLength; i++) {
                const existingWeek = program.weeks ? program.weeks[i] : null;
                const week = {
                    weekNumber: i + 1,
                    workouts: []
                };

                // Loop through each day/workout in the week
                for (let j = 0; j < programDays; j++) {
                    const existingWorkout = existingWeek?.workouts ? existingWeek.workouts[j] : null;
                    const workout = existingWorkout
                        ? { ...existingWorkout } // Copy the existing workout if it exists
                        : { name: `Day ${j + 1}`, excercises: [] }; // Otherwise, create a new workout

                    week.workouts.push(workout);
                }

                newProgram.weeks.push(week);
            }

            setCopyProgram(newProgram);
        }

        createProgram(program.name, program.length, program.days);
    }, [program.name, program.length, program.days, program.weeks]);

    return (
        <>
            {copyProgram && (
                <ProgramExcercises 
                    program={copyProgram}
                    setProgram={setCopyProgram}
                />
            )}
        </>
    );
}