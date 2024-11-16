'use client';

import { useState } from 'react'

export default function ProfileActions({ userId, userName, relationshipType }) {
  
  const [relation, setRelation] = useState(relationshipType);

  console.log(relation);
  
  const requestCoaching = async () => {
    try {
      const response = await fetch(`/api/coach/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coachId: userId,
          message: `I would like to request coaching from ${userName}.`,
        }),
      });

      if (response.ok) {
        alert('Coaching request sent successfully!');
        setRelation('Pending Coach Request Sent');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to send request'}`);
      }
    } catch (error) {
      console.error('Error sending coaching request:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleFollow = () => {
    alert('Follow functionality not implemented yet.');
  };

  return (
    <div className="flex space-x-4 mt-4">
      {( relation === 'Pending Request (Check Notifications)' || relation === null) ? (
          <button
          className="bg-black text-white rounded-lg p-4 font-bold"
          onClick={requestCoaching}
        >
          Request Coaching
        </button>
      ) : relation === 'Coaching' ? (
        <button
        className="bg-black text-white rounded-lg p-4 font-bold"
        onClick={requestCoaching}
        disabled={true}
      >
        Current Coach
      </button>
      ) : (
        <button
        className="bg-black text-white rounded-lg p-4 font-bold"
        onClick={requestCoaching}
        disabled={true}
      >
        Pending...
      </button>
      )}

      <button
        className="bg-black text-white rounded-lg p-4 font-bold"
        onClick={handleFollow}
      >
        Follow
      </button>
    </div>
  );
}