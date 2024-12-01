import Image from 'next/image';
import Link from 'next/link';
import { EyeIcon as EyeIconOutline } from '@heroicons/react/outline';
import { EyeIcon as EyeIconSolid } from '@heroicons/react/solid';

export default function User({ user }) {
  return (
    <div className="flex w-full justify-between items-center border-b-2 border-border rounded shadow-sm bg-background-secondary p-4">
      <div className="flex items-center">
        <Image
          src={user.image || '/avatar.svg'}
          alt={`${user.name}'s profile`}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="ml-4">
          <h3 className="text-lg font-bold">{user.name}</h3>
          <p className="text-secondary-text">{user.email}</p>
        </div>
      </div>
      <Link
        href={`/profile/${user.id}`}
        className="relative group rounded-lg p-2 hover:bg-gray-50 duration-300"
        aria-label={`View ${user.name}'s profile`}
      >
        <EyeIconOutline className="h-6 w-6 text-primary-text transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0" />
        <EyeIconSolid className="h-6 w-6 text-primary-text left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100" />
      </Link>
    </div>
  );
}
