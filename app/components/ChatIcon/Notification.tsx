export default function Notification({ notification, currentUser, onAccept, onDecline }) {
    const isCoach = currentUser.id === notification.coach.id;
    const isClient = currentUser.id === notification.client.id;
  
    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg mb-2 flex justify-between items-center">
        <div>
          <p className="font-semibold">
            {isCoach
              ? `Request from ${notification.client.name}`
              : `Request to ${notification.coach.name}`}
          </p>
          <p className="text-sm text-gray-400">
            {isCoach ? notification.client.email : notification.coach.email}
          </p>
        </div>
  
        {isCoach ? (
          // Coach View: Show Accept and Decline Buttons if the status is "PENDING"
          notification.status === 'PENDING' ? (
            <div className="flex flex-col items-center">
              <button
                className="px-2 py-1 rounded text-white hover:bg-green-700 w-full text-center"
                onClick={() => onAccept(notification.id)}
              >
                Accept
              </button>
              <button
                className="px-2 py-1 rounded text-white hover:bg-red-700 w-full text-center"
                onClick={() => onDecline(notification.id)}
              >
                Decline
              </button>
            </div>
          ) : (
            // If the request is accepted or declined, show the status
            <div className="text-center">
              <p
                className={`text-sm font-semibold ${
                  notification.status === 'ACCEPTED'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {notification.status === 'ACCEPTED' ? 'Accepted' : 'Declined'}
              </p>
            </div>
          )
        ) : isClient ? (
          // Client View: Show the status of the request
          <div className="text-center">
            <p
              className={`text-sm font-semibold ${
                notification.status === 'ACCEPTED'
                  ? 'text-green-500'
                  : notification.status === 'PENDING'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {notification.status === 'ACCEPTED'
                ? 'Accepted'
                : notification.status === 'PENDING'
                ? 'Pending'
                : 'Declined'}
            </p>
          </div>
        ) : null}
      </div>
    );
  }