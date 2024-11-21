import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import horieditIcon from '../../assets/edit-hori.svg';
import { useRouter } from 'next/navigation';

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

    router.push(`/programs/client/${clientId}`)

  }

  const onViewWorkout = (clientId) => {

    router.push(`/workouts/current/${clientId}`)

  }

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
    <div className="w-full bg-white p-4 rounded shadow-md flex items-center justify-between relative border-b-2">
      {/* Client Information */}
      <div className="flex items-center space-x-4">
        <Image
          src={client.client.image || '/avatar.svg'}
          alt={`${client.client.name}'s profile`}
          className="w-16 h-16 rounded-full object-cover"
          width={64}
          height={64}
        />
        <h2 className="text-xl font-semibold">{client.client.name}</h2>
      </div>

      {/* "More" Button */}
      <div className='relative'>
        <button>
          <Image 
            onClick={() => setIsMenuOpen(true)}
            src={horieditIcon}
            alt='edit set'
            width={32}
            height={32}
          />
        </button>

        {/* Action Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="fixed sm:absolute right-0 mt-2 bg-white shadow-lg rounded p-4 space-y-2 z-50 w-[200px]"
          >
            <h2>{client.client.name}</h2>
         <button
          onClick={() => onAssignProgram(client.client.id)}
          className="w-full border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
        >
          Assign Program
        </button>
        <button
          onClick={() => onViewProgram(client.client.id)}
          className="w-full border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
        >
          View Program
        </button>
        <button
          onClick={() => onViewWorkout(client.client.id)}
          className="w-full border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
          >
          View Next Workout
        </button>
        <button
          onClick={() => onDeleteClient(client.id)}
          className="w-full border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
        >
          Delete Client
        </button>
          </div>
        )}
      </div>
      </div>

  );
}