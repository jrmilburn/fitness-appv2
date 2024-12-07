import { useState, useEffect, useRef } from 'react';
import verteditIcon from '../../assets/edit-vert.svg';
import Image from 'next/image';
import SetForm from './SetForm';
import Loader from '../Loader';

export default function Set({ 
  setId, 
  Rir, 
  workout, 
  setWorkout, 
  onDelete, 
  onAdd, 
  onDataFetch, 
  disabled=false, 
  activityTime, 
  restTime, 
  type='hypertrophy',
  updatingSets = {}, 
  onSetUpdate
}) {
  const [focusedInput, setFocusedInput] = useState(''); 
  const [weight, setWeight] = useState(null);
  const [reps, setReps] = useState(null);
  const [activity, setActivity] = useState(activityTime);
  const [rest, setRest] = useState(restTime);
  const [recommendedReps, setRecommendedReps] = useState(null);
  const [lowerBoundWeight, setLowerBoundWeight] = useState(null);
  const [recommendedWeight, setRecommendedWeight] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);

  const exercise = workout?.excercises?.find(e => e.sets.some(s => s.id === setId));
  const currentSet = exercise ? exercise.sets.find(s => s.id === setId) : null;

  const isChecked = currentSet?.completed ?? false;
  const sendingSet = updatingSets[setId] || false;

  useEffect(() => {
    if (activityTime !== undefined) setActivity(activityTime);
    if (restTime !== undefined) setRest(restTime);
  }, [activityTime, restTime]);

  const roundToNearest2_5 = (num) => {
    return Math.ceil(num / 2.5) * 2.5;
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/set/${setId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setRecommendedReps(data.recommendedReps || null);
      const roundedWeight = data.recommendedWeight ? roundToNearest2_5(data.recommendedWeight) : null;
      setRecommendedWeight(roundedWeight);
      
      const lowerBound = roundedWeight ? Math.floor((roundedWeight / 1.05) / 2.5) * 2.5 : null;
      setLowerBoundWeight(lowerBound);

      if (onDataFetch) {
        onDataFetch({
          setId,
          recommendedReps: data.recommendedReps,
          recommendedWeight: roundedWeight,
          lowerBoundWeight: lowerBound
        });
      }

      if(data?.reps === 0) {
        setReps(null);
      } else {
        setWeight(data.weight);
        setReps(data.reps);
        setActivity(data.activity);
        setRest(data.rest);
      }
    });
  }, [setId]);

  const handleSubmit = async (e, setId) => {
    e.preventDefault();
    const newCheckedValue = !isChecked;
    await onSetUpdate({
      setId,
      weight,
      reps,
      activity,
      rest,
      completed: newCheckedValue,
      setWorkout
    });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

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

  // Update workout state when activity changes
  const handleActivityChange = (e) => {
    const value = e.target.value;
    const numericValue = value === '' ? 0 : Number(value);
    setActivity(numericValue);

    setWorkout((prev) => ({
      ...prev,
      excercises: prev.excercises.map((exc) => ({
        ...exc,
        sets: exc.sets.map((s) =>
          s.id === setId ? { ...s, activity: numericValue } : s
        ),
      })),
    }));
  };

  // Update workout state when rest changes
  const handleRestChange = (e) => {
    const value = e.target.value;
    const numericValue = value === '' ? 0 : Number(value);
    setRest(numericValue);

    setWorkout((prev) => ({
      ...prev,
      excercises: prev.excercises.map((exc) => ({
        ...exc,
        sets: exc.sets.map((s) =>
          s.id === setId ? { ...s, rest: numericValue } : s
        ),
      })),
    }));
  };

  return (
    <>
      <div className="flex justify-between space-x-8 items-center relative">
        <button className='absolute left-[-1%]' disabled={workout.completed || disabled}>
          <Image 
            onClick={handleEditClick}
            src={verteditIcon}
            alt='edit set'
          />
        </button>
        {type === 'hypertrophy' && (
          <>
            <input
              type="number"
              placeholder={`Weight`}
              className="w-[50%] mt-2 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
              onFocus={() => setFocusedInput('weight')}
              onBlur={() => setFocusedInput('')}
              value={weight !== null ? weight : ''}
              onChange={(e) => {
                const value = e.target.value;
                setWeight(value === '' ? null : +value);
                setWorkout((prev) => ({
                  ...prev,
                  excercises: prev.excercises.map((exc) => ({
                    ...exc,
                    sets: exc.sets.map((s) =>
                      s.id === setId ? { ...s, weight: value === '' ? null : +value } : s
                    ),
                  })),
                }));
              }}
              disabled={workout.completed || disabled || sendingSet}
            />
            
            <input
              type="number"
              placeholder={`${Rir} RIR`}
              className="w-[50%] mt-2 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
              onFocus={() => setFocusedInput('reps')}
              onBlur={() => setFocusedInput('')}
              value={reps !== null ? reps : ''}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = value === '' ? null : +value;
                setReps(numericValue);
                setWorkout((prev) => ({
                  ...prev,
                  excercises: prev.excercises.map((exc) => ({
                    ...exc,
                    sets: exc.sets.map((s) =>
                      s.id === setId ? { ...s, reps: numericValue } : s
                    ),
                  })),
                }));
              }}
              disabled={workout.completed || disabled || sendingSet}
            />
          </>
        )}

        {type === 'cardio' && (
          <>
            <input
              type="number"
              placeholder={`Activity`}
              className="w-[50%] mt-2 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
              onFocus={() => setFocusedInput('weight')}
              onBlur={() => setFocusedInput('')}
              value={activity !== null ? activity : ''}
              onChange={handleActivityChange}
              disabled={workout.completed || disabled || sendingSet}
            />
            
            <input
              type="number"
              placeholder={`Rest`}
              className="w-[50%] mt-2 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
              onFocus={() => setFocusedInput('reps')}
              onBlur={() => setFocusedInput('')}
              value={rest !== null ? rest : ''}
              onChange={handleRestChange}
              disabled={workout.completed || disabled || sendingSet}
            />
          </>
        )}

        <button
          onClick={(e) => handleSubmit(e, setId)}
          className={`w-8 h-8 rounded-sm border-2 ${
            isChecked ? 'bg-green-500 border-blue-500' : 'border-gray-300'
          } flex items-center justify-center transition-all duration-300`}
          disabled={workout.completed || sendingSet || disabled}
        >
          {sendingSet ? (
            // Use the Loader component here
            <Loader />
          ) : isChecked ? (
            // Checkbox icon
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
          ) : null}
        </button>
        {isEditing && (
          <div ref={formRef} className='absolute top-[10%] z-50'>
            <SetForm 
              onDelete={onDelete}
              onAdd={onAdd}
            />
          </div>
        )}
      </div>

      {type === "hypertrophy" && (
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
              {recommendedWeight ? (
                <p className='text-secondary-text'>Recommended weight: {lowerBoundWeight}kg - {recommendedWeight}kg</p>
              ) : (
                <p className='text-secondary-text'>Recommended {Rir} RIR</p>
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
              {recommendedReps ? (
                <p className='text-secondary-text'>Aim for {recommendedReps} reps this set</p>
              ) : (
                <p className='text-secondary-text'>Recommended {Rir} RIR</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}