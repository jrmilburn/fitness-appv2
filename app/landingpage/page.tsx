'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
        <div className="md:w-1/2 text-center md:text-left space-y-8 flex flex-col">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
            Welcome to JFit
          </h1>
          <p className="text-xl text-gray-600">
            Transform your fitness journey with personalized workouts and real-time progress tracking.
          </p>
          <Link href={'/landingpage/register'}>
          <button className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-300">
          <span>Sign Up</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
            </button>
            </Link>
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