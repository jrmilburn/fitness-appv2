"use client";

import { useState, useEffect } from 'react';
import CustomExcercise from "./CustomExcercise";
import NewExcercise from '../CreateProgram/NewExcercise';
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useMediaQuery } from 'react-responsive';
import { useSession } from 'next-auth/react';

export default function CustomExcercises({ excercises, muscleGroups }) {
  const [newShown, setNewShown] = useState(false);
  const [show, setShow] = useState(false); // State to control modal animation
  const [customExcercises, setCustomExcercises] = useState(excercises);
  const { data: session } = useSession();

  // Determine if the screen is mobile
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Tailwind's 'sm' breakpoint is 640px

  useEffect(() => {
    if (newShown) {
      setShow(true); // Trigger the entry animation when modal is shown
    }
  }, [newShown]);

  const handleDelete = async (excerciseId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/excercises/create/${excerciseId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      setCustomExcercises((prevExcercises) =>
        prevExcercises.filter((excercise) => excercise.id !== excerciseId)
      );
    }
  };

  // Handler to open the modal
  const handleOpen = () => {
    setNewShown(true);
  };

  // Handler to close the modal with animation
  const handleClose = () => {
    setShow(false); // Start exit animation
    setTimeout(() => {
      setNewShown(false); // Unmount the modal after animation
    }, 300); // Match the duration with the CSS transition duration
  };

  // Overlay and modal class names
  const overlayClassNames = `fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${
    show ? 'opacity-100' : 'opacity-0'
  }`;

  // Modal content class names based on screen size
  const modalContentClassNames = isMobile
    ? `bg-background rounded-t-lg flex flex-col items-center transform w-full fixed top-16 left-0 right-0 bottom-0 transition-transform duration-300 ease-in-out ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`
    : `bg-background rounded-lg flex flex-col items-center transform w-full max-w-md mx-auto fixed top-1/2 left-1/2 transition-all duration-300 ease-in-out ${
        show ? 'opacity-100 translate-y-[-50%] translate-x-[-50%]' : 'opacity-0 translate-y-[-50%] translate-x-[-50%]'
      }`;

  return (
    <div className="max-w-2xl flex flex-col mx-auto">
      <div className="flex w-full justify-between border-b-2 border-border p-4 items-center">
        <h2 className="relative text-2xl pr-4 sm:text-3xl text-primary-text">Custom Exercises
        </h2>
        <button
          className=" relative inter-bold border-2 p-2 hover:bg-background-secondary rounded flex gap-2 text-primary-text"
          onClick={handleOpen}
          disabled={session?.user?.role === "USER" && customExcercises.length >=3}
        >
          New <PlusCircleIcon className="h-6 w-6 text-primary-text" />
        </button>
      </div>

      {customExcercises.map((excercise) => (
        <CustomExcercise
          key={excercise.id}
          excercise={excercise}
          onDelete={() => handleDelete(excercise.id)}
        />
      ))}

      {newShown && (
        <div className={overlayClassNames}>
          <div className={modalContentClassNames}>
            <NewExcercise
              workoutId={null}
              muscleGroups={muscleGroups}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
