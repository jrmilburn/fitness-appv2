const submitSet = async ({ setId, weight, reps, activity, rest, completed, setWorkout }) => {
  // Update the workout state locally with all fields
  setWorkout(prev => ({
    ...prev,
    excercises: prev.excercises.map(excercise => ({
      ...excercise,
      sets: excercise.sets.map(set =>
        set.id === setId
          ? { ...set, completed, weight, reps, activity, rest }
          : set
      )
    }))
  }));

  // Send updated data to server
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/set/${setId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ weight, reps, activity, rest, completed })
  });

  // Optionally, if you want to rely on server confirmation or new data returned:
  const data = await response.json();
  // If the server returns updated data, you can re-set the local state with it:
  setWorkout(prev => ({
    ...prev,
    excercises: prev.excercises.map(excercise => ({
      ...excercise,
      sets: excercise.sets.map(set =>
        set.id === setId
          ? {
              ...set,
              // Use data from server response if needed
              weight: data.weight,
              reps: data.reps,
              activity: data.activity,
              rest: data.rest,
              completed: data.completed
            }
          : set
      )
    }))
  }));
};

export { submitSet}