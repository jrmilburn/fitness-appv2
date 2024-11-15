import { useState } from 'react';
import { ChatAlt2Icon, XIcon } from '@heroicons/react/solid';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

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
            <span className="font-semibold">Messages</span>
            <button onClick={toggleChat} className="text-gray-400 hover:text-gray-200">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            {/* Messages content goes here */}
          </div>
        </div>
      )}
    </div>
  );
}