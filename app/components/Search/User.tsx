import Image from 'next/image';
import Link from 'next/link';


export default function User({ user }) {
  return (
    <Link
      href={`/profile/${user.id}`}
      className="relative group rounded-lg bg-background-secondary hover:bg-background duration-300"
      aria-label={`View ${user.name}'s profile`}
    >
    <div className="flex w-full justify-between items-center border-b-2 border-border rounded shadow-sm p-4">
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

    </div>
    </Link>

  );
}
