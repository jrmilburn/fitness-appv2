'use client';

import { useState } from 'react';

export default function SettingsForm({ user, latestBodyWeight }) {
    const [bodyweight, setBodyweight] = useState(latestBodyWeight || '');
    const [username, setUsername] = useState(user.username || '');

    const handleUserUpdate = async (e) => {
        e.preventDefault();

        console.log(user.id);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bodyweight,
                username,
            }),
        });

        if (response.ok) {
            console.log('User updated successfully');
        } else {
            console.error('Error updating user');
        }
    };

    return (
        <form onSubmit={handleUserUpdate} className="flex flex-col space-y-6 w-[60%] mx-auto">
            <div className="flex justify-around items-center">
                <label htmlFor="bodyweight">Bodyweight: </label>
                <input
                    type="number"
                    placeholder="Bodyweight"
                    className="p-2 rounded border-2"
                    id="bodyweight"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(+e.target.value)}
                />
            </div>

            <div className="flex justify-around items-center">
                <label htmlFor="username">Username: </label>
                <input
                    type="text"
                    placeholder="Username"
                    className="p-2 rounded border-2"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <button type="submit" className="border-2 p-2 text-lg hover:bg-gray-300 font-bold duration-300">
                Save
            </button>
        </form>
    );
}