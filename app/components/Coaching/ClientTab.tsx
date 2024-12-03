import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import horieditIcon from '../../assets/edit-hori.svg';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientTab({ client, onAssignProgram, onDeleteClient }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  const onViewProgram = (clientId) => {
    router.push(`/programs/client/${clientId}`);
  };

  const onViewWorkout = (clientId) => {
    router.push(`/workouts/current/${clientId}`);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="w-full bg-background-secondary p-4 shadow-md flex items-center justify-between relative border-2 border-border text-primary-text hover:bg-background transition-bg duration-300">
      {/* Link wrapping the main clickable content */}
      <Link
        href={`/profile/${client.client.id}`}
        className="flex items-center space-x-4 w-full"
      >
        <Image
          src={client.client.image || '/avatar.svg'}
          alt={`${client.client.name}'s profile`}
          className="w-12 h-12 rounded-full object-cover"
          width={64}
          height={64}
        />
        <h2 className="text-xl inter-bold">{client.client.name}</h2>
      </Link>

      {/* "More" Button and Menu */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevent default behavior of Link click
            setIsMenuOpen(true);
          }}
        >
          <Image
            src={horieditIcon}
            alt="edit set"
            width={32}
            height={32}
          />
        </button>

        {/* Action Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="fixed sm:absolute border-2 border-border right-0 mt-2 bg-background shadow-lg rounded p-4 space-y-2 z-50 w-[200px]"
          >
            <h2 className="text-primary-text inter-bold">{client.client.name}</h2>
            <button
              onClick={() => onAssignProgram(client.client.id)}
              className="w-full border-2 border-border px-4 py-2 rounded text-primary-text hover:bg-highlight"
            >
              Assign Program
            </button>
            <button
              onClick={() => onViewProgram(client.client.id)}
              className="w-full border-2 border-border px-4 py-2 rounded text-primary-text hover:bg-highlight"
            >
              View Program
            </button>
            <button
              onClick={() => onViewWorkout(client.client.id)}
              className="w-full border-2 border-border px-4 py-2 rounded text-primary-text hover:bg-highlight"
            >
              View Next Workout
            </button>
            <button
              onClick={() => onDeleteClient(client.id)}
              className="w-full border-2 border-border px-4 py-2 rounded text-primary-text hover:bg-highlight"
            >
              Delete Client
            </button>
          </div>
        )}
      </div>
    </div>
  );
}