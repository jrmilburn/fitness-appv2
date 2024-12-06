// helper-functions.js
const submitSet = async ({ setId, weight, reps, activity, rest, completed, setWorkout }) => {
    // Update the workout state locally
    setWorkout(prev => ({
      ...prev,
      excercises: prev.excercises.map(excercise => ({
        ...excercise,
        sets: excercise.sets.map(set => 
          set.id === setId ? { ...set, completed } : set
        )
      }))
    }));
  
    // Save updated state to server
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/set/${setId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ weight, reps, activity, rest, completed })
    });
  };
  
  export { submitSet };
  