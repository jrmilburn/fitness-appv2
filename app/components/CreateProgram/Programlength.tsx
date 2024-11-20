import Radiobtn from '../Radiobtn';
import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

export default function ProgramLength({ onNext, setProgram, onPrevious }) {
    const [programLength, setProgramLength] = useState(null);
    const [programDays, setProgramDays] = useState(null);
    const [programName, setProgramName] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    function createProgram(programName, programLength, programDays) {
        const program = {
            name: programName,
            length: programLength,
            days: programDays,
            weeks: []
        };

        for (let i = 0; i < programLength; i++) {
            const week = { weekNumber: i + 1, workouts: [] };
            for (let j = 0; j < programDays; j++) {
                const workout = { name: `Day ${j + 1}`, excercises: [] };
                week.workouts.push(workout);
            }
            program.weeks.push(week);
        }

        setProgram(program);
    }

    useEffect(() => {
        setIsFormValid(programName !== '' && programLength !== null && programDays !== null);
    }, [programName, programLength, programDays]);

    const handleProgramNameChange = (e) => setProgramName(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        createProgram(programName, programLength, programDays);
        onNext(1);
    };

    return (
        <>
        <div className="w-full max-w-screen-sm mx-auto mt-4 relative flex justify-between sm:block">
                <button
                    onClick={onPrevious}
                    className="sm:absolute sm:left-0 sm:top-0 p-2 text-gray-700 hover:text-gray-900 focus:outline-none sm:translate-x-[-100%]"
                >
                    <FiArrowLeft size={24} />
                </button>
                <h2 className="text-3xl text-center w-full">Create New</h2>
            </div>
        <form onSubmit={handleSubmit} className="w-full p-4 sm:p-8 bg-white sm:shadow-md rounded-lg mx-auto max-w-screen-sm sm:border-2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">General Details</h2>

            <div className="flex flex-col space-y-6 w-full">
                {/* Program Name Input */}
                <input
                    type="text"
                    name="programName"
                    id="programName"
                    placeholder="Enter Program Name"
                    className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm w-[50%] text-gray-700"
                    value={programName}
                    onChange={handleProgramNameChange}
                />

                {/* Program Length */}
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Program Length (weeks)</h3>
                    <div className="flex space-x-4">
                        <Radiobtn id="length4" name="length" text="4" onChange={() => setProgramLength(4)} checked={programLength === 4} />
                        <Radiobtn id="length6" name="length" text="6" onChange={() => setProgramLength(6)} checked={programLength === 6} />
                        <Radiobtn id="length8" name="length" text="8" onChange={() => setProgramLength(8)} checked={programLength === 8} />
                    </div>
                </div>

                {/* Days Per Week */}
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Days Per Week</h3>
                    <div className="flex space-x-4">
                        <Radiobtn id="day2" name="days" text="2" onChange={() => setProgramDays(2)} checked={programDays === 2} />
                        <Radiobtn id="day3" name="days" text="3" onChange={() => setProgramDays(3)} checked={programDays === 3} />
                        <Radiobtn id="day4" name="days" text="4" onChange={() => setProgramDays(4)} checked={programDays === 4} />
                        <Radiobtn id="day5" name="days" text="5" onChange={() => setProgramDays(5)} checked={programDays === 5} />
                        <Radiobtn id="day6" name="days" text="6" onChange={() => setProgramDays(6)} checked={programDays === 6} />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`p-4 rounded-lg text-white font-semibold ${isFormValid ? 'bg-black hover:bg-gray-900' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!isFormValid}
                >
                    Next
                </button>
            </div>
        </form>
        </>
    );
}