"use client";

import { useState, useEffect } from 'react';
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useMediaQuery } from 'react-responsive';
import { useSession } from 'next-auth/react';
import CustomFood from './CustomFood';
import NewFood from './NewFood';

export default function CustomFoods({ foods, onAdd, canDelete }) {
  const [newShown, setNewShown] = useState(false);
  const [show, setShow] = useState(false); // State to control modal animation
  const [customFoods, setCustomFoods] = useState(foods);
  const { data: session } = useSession();

  // Determine if the screen is mobile
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Tailwind's 'sm' breakpoint is 640px

  useEffect(() => {
    if (newShown) {
      setShow(true); // Trigger the entry animation when modal is shown
    }
  }, [newShown]);

  const handleDelete = async (foodId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/foods/create/${foodId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      setCustomFoods((prevFoods) =>
        prevFoods.filter((food) => food.id !== foodId)
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
    <div className="max-w-2xl flex flex-col mx-auto translate-x-[25%]">
      <div className="flex w-full justify-between border-b-2 border-border p-4 items-center">
       {/* <h2 className="relative text-2xl pr-4 sm:text-3xl text-primary-text">Custom Exercises
          {session?.user?.role === "USER" && <PremiumIcon text={`Upgrade to premium for unlimited custom excercises. ${3 - customExcercises.length} remaining`}/>}
        </h2> */}
        <button
          className=" relative inter-bold border-2 p-2 hover:bg-background-secondary rounded flex gap-2 text-primary-text"
          onClick={handleOpen}
          disabled={session?.user?.role === "USER" && customFoods.length >=3}
        >
          New <PlusCircleIcon className="h-6 w-6 text-primary-text" />
        </button>
      </div>

      {customFoods?.map((food) => (
        <CustomFood
          key={food.id}
          food={food}
          onAdd={() => onAdd(food)}
          onDelete={() => handleDelete(food.id)}
          canDelete={canDelete}
        />
      ))}

      {newShown && (
        <div className={overlayClassNames}>
          <div className={modalContentClassNames}>
            <NewFood
              onClose={handleClose}
              show={newShown}
            />
          </div>
        </div>
      )}
    </div>
  );
}
