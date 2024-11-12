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

            <button onClick={handleClick}>
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