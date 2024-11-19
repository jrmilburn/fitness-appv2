import { useState, useEffect } from 'react';
import { ChatAlt2Icon, XIcon } from '@heroicons/react/solid';
import Notification from './Notification';
import { useSession } from 'next-auth/react';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

   const { data: session } = useSession();

   const user = session?.user;

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coach`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch notifications:', response.statusText);
          return;
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coach/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACCEPTED' }),
      });
  
      if (!response.ok) {
        console.error('Failed to accept request:', response.statusText);
        return;
      }
  
      const updatedNotification = await response.json();
  
      // Update the status in the notifications array
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, status: 'ACCEPTED' }
            : notification
        )
      );
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };
  
  const handleDecline = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coach/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'DECLINED' }),
      });
  
      if (!response.ok) {
        console.error('Failed to decline request:', response.statusText);
        return;
      }
    
      // Update the status in the notifications array
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, status: 'DECLINED' }
            : notification
        )
      );
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  return (
    <div className="fixed bottom-5 right-5">
      {/* Chat Icon Button */}
      <div
        onClick={toggleChat}
        className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black text-white 
                   flex items-center justify-center rounded-full cursor-pointer shadow-lg 
                   transition transform hover:scale-105 hover:shadow-xl"
      >
        <ChatAlt2Icon className="w-8 h-8" />
      </div>

      {/* Chat Popup Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-gray-900 text-gray-100 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-gray-800 to-black text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            <button onClick={toggleChat} className="text-gray-400 hover:text-gray-200">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            Coaching Requests
            {notifications.map((notification) => {
              console.log(notification)
              return (
              <Notification 
                key={notification.id}
                notification={notification}
                currentUser={user}
                onAccept={() => handleAccept(notification.id)}
                onDecline={() => handleDecline(notification.id)}
                status={notification.status}
              />
            )})}
          </div>
        </div>
      )}
    </div>
  );
}