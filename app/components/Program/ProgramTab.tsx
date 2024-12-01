"use client"

import Link from 'next/link'

type ProgramTabProps = {
  name: string;
  length: number;
  days: number;
  id: string;
  userProgramId: string | null;
  created: string;
  canDelete: boolean;
  onDelete?: () => void; // Optional prop
  completed: boolean;
  workoutId: string;
};

export default function ProgramTab({
  name,
  length,
  days,
  id,
  userProgramId,
  created,
  canDelete,
  onDelete,
  completed,
  workoutId
}: ProgramTabProps) {



  return (
    <div className={`w-3xl border-2 border-border ${id === userProgramId ? 'border-green-200' : 'border-border'} p-4 relative bg-background-secondary`}>
      <div className="w-full flex justify-between space-x-16 p-2">
        {userProgramId === null && !completed ? (
          <>
            <Link href={`/workouts/current/${workoutId}`}>
            <div>
              <h2 className="text-xl text-primary-text">{name}</h2>
              <p className="text-sm text-secondary-text">Saved</p>
            </div>
            <div className="flex flex-col space-y-4 justify-center text-primary-text">
              {canDelete && id !== userProgramId && onDelete && !completed && (
                <button onClick={onDelete}>
                  Delete
                </button>
              )}
            </div>
            </Link>
          </>
        ) : completed ? (
          <>
          <Link href={`/workouts/current/${workoutId}`}>
          <div>
          <h2 className="text-xl text-primary-text">{name}</h2>
          <p className="text-sm text-secondary-text">
            {length} Weeks - {days} Days / Week
          </p>
          <p className="text-sm text-secondary-text">Created: {created}</p>
        </div>
        <div className="flex flex-col space-y-4 justify-center text-primary-text">
        </div>
        </Link>
        </>
        ) : (
          <>
            <Link href={`/workouts/current/${workoutId}`} className='flex justify-between w-full'>
            <div>
              <h2 className="text-xl text-primary-text">{name}</h2>
              <p className="text-sm text-secondary-text">
                {length} Weeks - {days} Days / Week
              </p>
              <p className="text-sm text-secondary-text">Created: {created}</p>
            </div>
            <div className="flex flex-col space-y-4 justify-center text-primary-text">
              {canDelete && id !== userProgramId && onDelete && (
                <button onClick={onDelete}>
                  Delete
                </button>
              )}
            </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
