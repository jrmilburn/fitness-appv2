'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function SettingsForm({ user, latestBodyWeight }) {
    const [bodyweight, setBodyweight] = useState(latestBodyWeight || '');
    const [username, setUsername] = useState(user.username || '');
    const [profilePicture, setProfilePicture] = useState(user.image || '');
    const [bio, setBio] = useState(user.bio || '');

    const handleUserUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('bodyweight', bodyweight);
        formData.append('username', username);
        formData.append('bio', bio);

        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/users/${user.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            console.log('User updated successfully');
        } else {
            console.error('Error updating user');
        }
    };

    return (
        <form onSubmit={handleUserUpdate} className="flex flex-col space-y-6 w-[60%] mx-auto">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
            {/* Hidden File Input */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profilePicture"
                onChange={(e) => setProfilePicture(e.target.files[0])}
            />
            {/* Clickable Label wrapping the Image and Overlay */}
            <label htmlFor="profilePicture" className="relative group cursor-pointer">
                <Image
                    src={profilePicture || '/avatar.svg'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover shadow-md hover:shadow-lg transition-shadow duration-300"
                    width={128}
                    height={128}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300">
                    <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Change Photo
                    </span>
                </div>
            </label>
            {/* Caption below the Image */}
            <span className="text-sm font-semibold text-gray-700">
                Edit Profile Picture
            </span>
        </div>


            {/* Bodyweight */}
            <div className="flex justify-around items-center">
                <label htmlFor="bodyweight">Bodyweight: </label>
                <input
                    type="number"
                    placeholder="Bodyweight"
                    className="p-2 rounded border-2"
                    id="bodyweight"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                />
            </div>

            {/* Username */}
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

            <div className="flex justify-around items-center">
                <label htmlFor="bio">Biography: </label>
                <input
                    type="text"
                    placeholder="Biography"
                    className="p-2 rounded border-2"
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            <button type="submit" className="border-2 p-2 text-lg hover:bg-gray-300 font-bold duration-300">
                Save
            </button>
        </form>
    );
}