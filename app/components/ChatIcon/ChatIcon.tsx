import { useState, useEffect } from 'react';
import { ChatAlt2Icon, XIcon } from '@heroicons/react/solid';
import Notification from './Notification';
import { useSession } from 'next-auth/react';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const { data: session } = useSession();
  const user = session?.user;

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 200; // Adjust this value as needed
      if (window.scrollY < scrollThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => setShouldRender(false), 300); // Matches the fade-out duration
      return () => clearTimeout(timeout);
    } else {
      setShouldRender(true);
    }
  }, [isVisible]);

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

  return shouldRender ? (
    <div
      className={`fixed bottom-5 right-5 transform transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
    >
      {/* Chat Icon Button */}
      <div
        onClick={toggleChat}
        className="w-16 h-16 bg-gradient-to-br from-primary-text to-primary-text text-background 
                   flex items-center justify-center rounded-full cursor-pointer shadow-lg 
                   transition transform hover:scale-105 hover:shadow-xl"
      >
        <ChatAlt2Icon className="w-8 h-8" />
      </div>

      {/* Chat Popup Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-primary-text text-background rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-primary-text to-black text-background p-3 flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            <button onClick={toggleChat} className="text-gray-400 hover:text-gray-200">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            Coaching Requests
            {notifications.map((notification) => (
              <Notification 
                key={notification.id}
                notification={notification}
                currentUser={user}
                onAccept={() => handleAccept(notification.id)}
                onDecline={() => handleDecline(notification.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  ) : null;
}
