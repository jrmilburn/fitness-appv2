'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function SettingsForm({ user, latestBodyWeight }) {
    const [bodyweight, setBodyweight] = useState(latestBodyWeight || '');
    const [username, setUsername] = useState(user.username || '');
    const [profilePicture, setProfilePicture] = useState(user.image || '');
    const [bio, setBio] = useState(user.bio || '');
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Selected file is not an image.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB size limit
                setErrorMessage('Image size exceeds 5MB.');
                return;
            }
            setProfilePictureFile(file);
            setProfilePicture(URL.createObjectURL(file)); // Preview the image
            setErrorMessage(''); // Clear any previous errors
        }
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();

        if (!bodyweight || isNaN(bodyweight)) {
            setErrorMessage('Bodyweight must be a valid number.');
            return;
        }

        const formData = new FormData();
        formData.append('bodyweight', bodyweight);
        formData.append('username', username);
        formData.append('bio', bio);

        if (profilePictureFile) {
            formData.append('profilePicture', profilePictureFile);
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                setSuccessMessage('User updated successfully.');
                setErrorMessage('');
            } else {
                const error = await response.json();
                setErrorMessage(error.message || 'Error updating user.');
            }
        } catch (error) {
            setErrorMessage('Network error: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleUserUpdate} className="flex flex-col space-y-6 w-[60%] mx-auto">
            <h1 className="text-2xl inter-bold text-center">Update Profile</h1>
            
            {/* Success or Error Messages */}
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profilePicture"
                    onChange={handleProfilePictureChange}
                />
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
                <span className="text-sm inter-bold text-primary-text">Edit Profile Picture</span>
            </div>

            {/* Bodyweight */}
            <div className="flex space-x-4 justify-between items-center">
                <label htmlFor="bodyweight">Bodyweight: </label>
                <input
                    type="number"
                    placeholder="Bodyweight"
                    className="p-2 rounded border-2 w-full"
                    id="bodyweight"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                />
            </div>

            {/* Username */}
            <div className="flex space-x-4 justify-between items-center">
                <label htmlFor="username">Username: </label>
                <input
                    type="text"
                    placeholder="Username"
                    className="p-2 rounded border-2 w-full"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            {/* Biography */}
            <div className="flex space-x-4 justify-between items-center">
                <label htmlFor="bio">Biography: </label>
                <textarea
                    placeholder="Biography"
                    className="p-2 rounded border-2 w-full"
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                />
            </div>

            <button
                type="submit"
                className="border-2 p-2 text-lg hover:bg-gray-300 font-bold duration-300"
            >
                Save
            </button>
        </form>
    );
}
