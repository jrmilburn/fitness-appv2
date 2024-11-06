'use client';

import searchIcon from '../assets/search.svg';
import Image from 'next/image';
import Users from '../components/Search/Users';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Search() {
    const { data: session } = useSession();
    const currentUserId = session?.user?.id; // Get the current user's ID

    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => setUsers(data));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:3000/api/users/${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const users = await response.json();
        setUsers(users);
    };

    return (
        <div className="w-full h-full max-w-3xl mx-auto">
            <form className="w-[80%] mx-auto my-16 flex space-x-4" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-2 w-full p-4 rounded-xl text-xl"
                />
                <button type="submit">
                    <Image priority src={searchIcon} alt="Search icon" className="h-8 w-8" />
                </button>
            </form>
            <Users users={users} currentUserId={currentUserId} />
        </div>
    );
}