"use client";

import Link from 'next/link';
import { TrashIcon } from "@heroicons/react/outline";

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
  workoutId,
}: ProgramTabProps) {
  return (
    <Link href={`/workouts/${workoutId}`}>
    <div
      className={`w-3xl border-2 ${
        id === userProgramId ? 'border-green-200' : 'border-border'
      } p-4 relative bg-background-secondary hover:bg-background transition-all duration-300`}
    >
      <div className="w-full flex justify-between space-x-16 p-2">
        {userProgramId === null && !completed ? (
          <>
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
          </>
        ) : completed ? (
          <>
              <div>
                <h2 className="text-xl text-primary-text">{name}</h2>
                <p className="text-sm text-secondary-text">
                  {length} Weeks - {days} Days / Week
                </p>
                <p className="text-sm text-secondary-text">Created: {created}</p>
              </div>
          </>
        ) : (
          <>
            <div className="flex justify-between w-full">
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
                    <TrashIcon className="h-7 w-7 text-primary-text hover:text-red-400 transition-all duration-300" />
                  </button>
                )}
              </div>
            </div>
          </>
          
        )}
      </div>
    </div>
    </Link>

  );
}
