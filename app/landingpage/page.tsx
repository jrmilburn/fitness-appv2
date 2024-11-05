'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user) {
    router.push('/workouts/current');
  }

  return (
    <div className="flex flex-col items-center justify-between h-screen w-full bg-white">
      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl p-8 md:p-12">
        {/* Left Section */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
            Welcome to JFit
          </h1>
          <p className="text-xl text-gray-600">
            Transform your fitness journey with personalized workouts and real-time progress tracking.
          </p>
          <button
            onClick={() => signIn('google')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="#4285F4"
                d="M24 9.5c3.2 0 5.8 1.1 7.8 3.1l5.8-5.8C33.8 3.5 29.2 1.5 24 1.5 14.8 1.5 7.2 7.8 4.5 16.2l6.9 5.4C13.2 15.2 18.2 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24c0-1.6-.2-3.2-.5-4.7H24v9.4h12.7c-.5 2.5-1.9 4.6-3.9 6.1l6.1 4.7c3.6-3.3 5.6-8.1 5.6-13.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.5 28.2c-1-2.5-1-5.2 0-7.7l-6.9-5.4c-2.9 5.8-2.9 12.7 0 18.5l6.9-5.4z"
              />
              <path
                fill="#EA4335"
                d="M24 46.5c5.2 0 9.8-1.7 13.1-4.7l-6.1-4.7c-1.7 1.1-3.8 1.8-6.1 1.8-5.8 0-10.8-3.7-12.6-8.9l-6.9 5.4c3.2 6.3 9.7 10.9 17.6 10.9z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Sign in with Google
          </button>
        </div>

        {/* Right Section with Fade Effect */}
        <div className="md:w-1/2 flex justify-center items-center mt-8 md:mt-0 relative">
          <Image
            src="/mediamodifier_image.png"
            alt="App preview"
            width={600}
            height={1000}
            className="h-full w-auto object-contain"
          />
          {/* Gradient Overlay */}
          <div className="absolute left-0 top-0 h-full w-1/4 bg-gradient-to-l from-transparent to-white pointer-events-none"></div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-gray-100 py-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 space-y-4 md:space-y-0">
          {/* Contact Information */}
          <div className="text-gray-600 text-center md:text-left">
            <p className="font-semibold">Contact Us</p>
            <p>Email: support@jfit.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>

          {/* Footer Links */}
          <div className="flex space-x-4 text-gray-600 text-center">
            <a href="/privacy-policy" className="hover:text-gray-800">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-gray-800">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-gray-800">
              Contact
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4 text-gray-600">
            <a href="https://twitter.com" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}