import { useState, useEffect, useRef } from 'react';
import verteditIcon from '../../assets/edit-vert.svg'
import Image from 'next/image'
import SetForm from './SetForm';

export default function Set({ setId, Rir, workout, setWorkout, onDelete, onAdd }) {
  const [isChecked, setIsChecked] = useState(false);
  const [focusedInput, setFocusedInput] = useState(''); // State to track which input is focused
  const [weight, setWeight] = useState(null);
  const [reps, setReps] = useState(null);
  const [recommendedReps, setRecommendedReps] = useState(null);
  const [recommendedWeight, setRecommendedWeight] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/set/${setId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setRecommendedReps(data.recommendedReps || null);
      setRecommendedWeight(data.recommendedWeight || null);
      if(data?.reps === 0) {
        setReps(null)
      } else {
        setWeight(data.weight);
        setReps(data.reps);
        setIsChecked(data.completed);
      }

    })
  }, [setId])

  useEffect(() => {
    fetch(`http://localhost:3000/api/set/${setId}`, {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({weight, reps, completed: isChecked})
      });
  }, [isChecked])

  const handleSubmit = async (e, setId) => {
    e.preventDefault();
    const newCheckedValue = !isChecked;

    setIsChecked(newCheckedValue);

    setWorkout(prev => ({
      ...prev,
      excercises: prev.excercises.map(excercise => ({
        ...excercise,
        sets: excercise.sets.map(set => 
          set.id === setId ? { ...set, completed: newCheckedValue } : set
        )
      }))
    }));

  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  }

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);
  

  return (
    <>
      <div className="flex justify-between space-x-8 items-center relative">
        <button className='absolute left-[-1%]'>
          <Image 
            onClick={handleEditClick}
            src={verteditIcon}
            alt='edit set'
          />
        </button>
        <input
          type="number"
          placeholder={`Weight`}
          className="w-[50%] mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => setFocusedInput('weight')}
          onBlur={() => setFocusedInput('')}
          value={weight}
          onChange={(e) => setWeight(+e.target.value)}
          disabled={workout.completed}
        />

        <input
          type="number"
          placeholder={`${Rir} RIR`}
          className="w-[50%] mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => setFocusedInput('reps')}
          onBlur={() => setFocusedInput('')}
          value={reps}
          onChange={(e) => setReps(+e.target.value)}
          disabled={workout.completed}
        />

        {/* Custom Checkbox */}
        <button
          onClick={(e) => handleSubmit(e, setId)}
          className={`w-8 h-8 rounded-sm border-2 ${
            isChecked ? 'bg-green-500 border-blue-500' : 'border-gray-300'
          } flex items-center justify-center transition-all duration-300`}
          disabled={workout.completed}
        >
          {isChecked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        {isEditing && (
          <div ref={formRef} className='absolute top-[10%] z-50'>
            <SetForm 
              onDelete={onDelete}
              onAdd={onAdd}/>
          </div>
        )}
      </div>

      {/* Smooth Height Transition for Recommendations */}
      <div
        className={`relative w-full mt-4 overflow-hidden transition-max-height duration-500 ease-in-out ${
          focusedInput ? 'max-h-20' : 'max-h-0'
        }`}
      >

      <div className="w-full h-7 overflow-hidden text-center">
        <div
          className={`transition-opacity transition-transform duration-500 ease-in-out ${
            focusedInput === 'weight'
              ? 'opacity-100 translate-y-0'
              : focusedInput === 'reps' 
              ? 'opacity -translate-y-full'
              : 'opacity translate-y-full'
          }`}
        >
          {recommendedWeight && (
            <p>Recommended weight: {recommendedWeight}kg</p>
          )}
        </div>
        
        <div
          className={`transition-opacity transition-transform duration-500 ease-in-out ${
            focusedInput === 'reps'
              ? 'opacity-100 -translate-y-full'
              : focusedInput === 'weight'
              ? 'opacity translate-y-0'
              : 'opacity translate-y-full'
          }`}
        >
          {recommendedReps && (
            <p>Recommended reps: {recommendedReps}kg</p>
          )}
        </div>
      </div>
      </div>



    </>
  );
}