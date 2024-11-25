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
}: ProgramTabProps) {
  return (
    <div className={`w-3xl border-2 border-border ${id === userProgramId ? 'border-green-200' : 'border-border'} p-4 relative bg-background-secondary`}>
      <div className="w-full flex justify-between space-x-16 p-2">
        {userProgramId === null ? (
          <>
            <div>
              <h2 className="text-xl text-primary-text">{name}</h2>
              <p className="text-sm text-secondary-text">Saved</p>
            </div>
            <div className="flex flex-col space-y-4 justify-center text-primary-text">
              <Link href={`/programs/${id}`}>
                <button>View Program</button>
              </Link>
              {canDelete && id !== userProgramId && onDelete && (
                <button onClick={onDelete}>
                  Delete
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-xl text-primary-text">{name}</h2>
              <p className="text-sm text-secondary-text">
                {length} Weeks - {days} Days / Week
              </p>
              <p className="text-sm text-secondary-text">Created: {created}</p>
            </div>
            <div className="flex flex-col space-y-4 justify-center text-primary-text">
              <Link href={`/programs/${id}`}>
                <button>View Program</button>
              </Link>
              {canDelete && id !== userProgramId && onDelete && (
                <button onClick={onDelete}>
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
