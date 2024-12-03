'use client';

import searchIcon from '../assets/search.svg';
import Image from 'next/image';
import Users from '../components/Search/Users';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Search() {
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); // Start loading
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
                setLoading(false); // Stop loading
            });
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when a search is triggered

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/users/${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const users = await response.json();
        setUsers(users);
        setLoading(false); // Stop loading
    };

    return (
        <div className="w-full h-100% pb-16 sm:pb-0 max-w-3xl mx-auto">
            {/* Search Input and Button */}
            <form className="sm:w-[80%] w-[90%] mx-auto p-4  flex space-x-4" onSubmit={handleSearch}>
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

            {/* Conditional rendering: Skeletons or Users */}
            {loading ? (
                <div className="w-full sm:w-[80%] mx-auto grid gap-6">
                    {Array(5).fill(null).map((_, index) => (
                        <div key={index} className="flex w-full justify-between items-center border rounded-xl shadow-sm">
                            <div className="flex items-center">
                                <Skeleton circle={true} height={50} width={50} /> {/* Profile Image */}
                                <div className="ml-4">
                                    <Skeleton width={120} height={20} /> {/* Name */}
                                    <Skeleton width={180} height={16} /> {/* Email */}
                                </div>
                            </div>
                            <Skeleton width={100} height={36} /> {/* View Profile Button */}
                        </div>
                    ))}
                </div>
            ) : (
                <Users users={users} currentUserId={currentUserId} />
            )}
        </div>
    );
}