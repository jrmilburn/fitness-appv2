"use client";

import Programlength from '../components/CreateProgram/Programlength';
import Programexcercises from '../components/CreateProgram/Programexcercises';
import PreviousPrograms from '../components/CreateProgram/Previousprograms';
import ProgramTemplates from '../components/CreateProgram/Programtemplates';
import { useState } from 'react';

export default function CreateProgram() {

    const [formPage, setFormPage] = useState(1);

    const [program, setProgram] = useState({
        name: "",
        length: 0,
        days: 0,
        weeks: [] // Initialize weeks as an empty array
      });

    const onNext = () => {
        setFormPage((prevPage) => prevPage + 1);
    };

    const onPrevious = () => {
        setFormPage((prevPage) => prevPage - 1);
    }

    return (
        <main className="w-full h-[100%] flex items-baseline">

            {formPage === 1 ? (
                <div className='flex flex-col space-y-4 w-full h-screen overflow-y-auto'>
                    <Programlength setProgram={setProgram} onNext={onNext}/>
                    <PreviousPrograms setProgram={setProgram} onNext={onNext} />
                    <ProgramTemplates setProgram={setProgram} onNext={onNext} />
                </div>
                ) : (
                <Programexcercises 
                    program={program} 
                    setProgram={setProgram} 
                    type={0} 
                    onPrevious={onPrevious}
                />
                )}
            
        </main>
    )
}