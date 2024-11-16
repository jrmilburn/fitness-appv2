export default function Notification({ user, onAccept, onDecline }) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg mb-2 flex justify-between items-center">
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="px-2 py-1 rounded text-white hover:bg-green-700 w-full text-center"
            onClick={onAccept}
          >
            Accept
          </button>
          <button
            className="px-2 py-1 rounded text-white hover:bg-red-700 w-full text-center"
            onClick={onDecline}
          >
            Decline
          </button>
        </div>
      </div>
    );
  }