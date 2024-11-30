"use client"; // Indicate this is a client component
import { useState } from 'react';
import ProgramTab from './ProgramTab';

export default function ProgramsList({ initialPrograms, userProgramId }) {
  const [programs, setPrograms] = useState(initialPrograms);

  const handleDelete = async (id) => {
    try {

        console.log(id);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/program/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        }
      });
      if (response.ok) {
        console.log(response);
        setPrograms(programs.filter((program) => program.id !== id));
      } else {
        console.error('Failed to delete the program');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full bg-background">
      {programs.map((program) => (
        <ProgramTab
          key={program.id}
          id={program.id}
          name={program.name}
          length={program.length}
          days={program.days}
          userProgramId={userProgramId}
          created={new Date(program.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          canDelete={true}
          onDelete={() => handleDelete(program.id)}
        />
      ))}
    </div>
  );
}