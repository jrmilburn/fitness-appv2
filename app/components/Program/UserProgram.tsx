'use client'

import CopyProgram from "./CopyProgram"
import ProgramView from "./ProgramView"
import { useState } from 'react'

export default function UserProgram({ currentWeek, program}) {

    const [copying, setCopying] = useState(false);

    const handleClick = () => {

        const newCopying = !copying;

        setCopying(newCopying);

    }

    return (
        <>

            <button onClick={handleClick} className="bg-black p-4 text-white rounded-lg font-bold absolute bottom-5">
                {copying ? 'Back' : 'Copy'}
            </button>

            {copying ? (
                <CopyProgram 
                    program={program}/>
            ) : (
                <ProgramView 
                    week={currentWeek}/>
            )}

        </>

    )

}