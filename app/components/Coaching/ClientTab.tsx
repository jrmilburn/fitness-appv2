import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import horieditIcon from '../../assets/edit-hori.svg';

export default function ClientTab({ client, onAssignProgram, onDeleteClient, onMessageClient }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

    console.log(client);

  // Close the menu if clicked outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
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
    <div className="w-full bg-gray-100 p-4 rounded shadow-md flex items-center justify-between relative">
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
            className="absolute right-0 mt-2 bg-white shadow-lg rounded p-4 space-y-2 z-50 w-[200px]"
          >
            <h2>{client.client.name}</h2>
         <button
          onClick={() => onAssignProgram(client.id)}
          className="w-full border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
        >
          Assign Program
        </button>
        <button
          onClick={() => onDeleteClient(client.id)}
          className="w-full border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
        >
          Delete Client
        </button>
        <button
          onClick={() => onMessageClient(client.id)}
          className="w-full border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
        >
          Message Client
        </button>
          </div>
        )}
      </div>
      </div>

  );
}