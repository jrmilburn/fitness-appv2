'use client';

import { useState } from 'react';

export default function ProfileActions({ userId, userName, relationshipType, following }) {
  const [relation, setRelation] = useState(relationshipType);
  const [isFollowing, setIsFollowing] = useState(following); // State to track follow status

  console.log('RELATION: ', relation);

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

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert(`You are now following ${userName}!`);
        setIsFollowing(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to follow user'}`);
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/api/follow/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert(`You have unfollowed ${userName}.`);
        setIsFollowing(false);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to unfollow user'}`);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex space-x-4 mt-4">
      {/* Coaching Request Button */}
      {(relation === 'Pending Request (Check Notifications)' ||
        relation === 'Coaching' ||
        relation === null) ? (
        <button
          className="bg-black text-white rounded-lg p-4 font-bold"
          onClick={requestCoaching}
        >
          Request Coaching
        </button>
      ) : relation === 'Coach' ? (
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

      {/* Follow/Unfollow Button */}
      {isFollowing ? (
        <button
          className="bg-black text-white rounded-lg p-4 font-bold"
          onClick={handleUnfollow}
        >
          Unfollow
        </button>
      ) : (
        <button
          className="bg-black text-white rounded-lg p-4 font-bold"
          onClick={handleFollow}
        >
          Follow
        </button>
      )}
    </div>
  );
}