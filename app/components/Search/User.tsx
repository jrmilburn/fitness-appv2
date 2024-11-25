import Image from 'next/image';
import Link from 'next/link';

export default function User({ user }) {
    return (
        <div className='flex w-full justify-between items-center border-2 border-border md:rounded-xl shadow-sm bg-background-secondary  p-4'>
            <div className="flex items-center">
                <Image
                    src={user.image || '/avatar.svg'}
                    alt={`${user.name}'s profile`}
                    width={50}
                    height={50}
                    className="rounded-full"
                />
                <div className="ml-4">
                    <h3 className="text-lg inter-bold">{user.name}</h3>
                    <p className="text-secondary-text">{user.email}</p>
                </div>
            </div>
            <button className='border-2 border-border rounded-lg p-2 hover:bg-gray-50 duration-300'>
                <Link href={`/profile/${user.id}`}>
                    View Profile
                </Link>
            </button>
        </div>

    );
}