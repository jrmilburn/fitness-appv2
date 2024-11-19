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
                    const workout = {
                        name: existingWorkout ? existingWorkout.name : `Day ${j + 1}`,
                        excercises: existingWorkout 
                            ? existingWorkout.excercises.map(excercise => ({
                                ...excercise,
                                muscle: excercise.muscleGroup?.name || '' // Set muscle to the muscleGroup name or empty if not defined
                            }))
                            : [] 
                    };

                    week.workouts.push(workout);
                }

                newProgram.weeks.push(week);
            }

            console.log('Generated Program with Muscle Groups:', newProgram);
            setCopyProgram(newProgram);
        }

        createProgram(program.name, program.length, program.days);
    }, [program.name, program.length, program.days, program.weeks]);

    const onPrevious = () => {

    }

    return (
        <>
            {copyProgram && (
                <ProgramExcercises 
                    program={copyProgram}
                    setProgram={setCopyProgram}
                    type={1}
                    onPrevious={onPrevious}
                />
            )}
        </>
    );
}