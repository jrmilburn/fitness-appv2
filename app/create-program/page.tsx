"use client";

import Programlength from '../components/CreateProgram/Programlength';
import Programexcercises from '../components/CreateProgram/Programexcercises';
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

    return (

        <main className="w-full ml-12 p-8 h-[100%] flex">

            {formPage === 1 ? (<Programlength setProgram={setProgram} onNext={onNext}/>) : (<Programexcercises program={program} setProgram={setProgram} type={0}/>) }
            
        </main>

    )

}