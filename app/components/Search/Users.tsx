import User from './User';

export default function Users({ users, currentUserId }) {
    return (
        <div className="w-[80%] mx-auto grid gap-6">
            {users.length > 0 ? (
                users
                    .filter((user) => user.id !== currentUserId)
                    .map((user) => <User key={user.id} user={user} />)
            ) : (
                <p className="text-center text-gray-600">No users found</p>
            )}
        </div>
    );
}