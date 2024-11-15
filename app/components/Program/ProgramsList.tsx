"use client"; // Indicate this is a client component
import { useState } from 'react';
import ProgramTab from './ProgramTab';

export default function ProgramsList({ initialPrograms, userProgramId }) {
  const [programs, setPrograms] = useState(initialPrograms);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/program/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPrograms(programs.filter((program) => program.id !== id));
      } else {
        console.error('Failed to delete the program');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
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
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}