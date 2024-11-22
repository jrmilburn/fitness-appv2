'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if session is available
  useEffect(() => {
    if (session?.user) {
      router.push('/workouts/current');
    }
  }, [session, router]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-white to-gray-100">
      {/* Main Content */}
      <header className="flex flex-col md:flex-row items-center justify-between flex-grow w-full px-6 md:px-12 py-12 md:py-16 max-w-[1200px] mx-auto">
        {/* Left Section */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left relative">
          {/* Background Graphic */}
          <div className="absolute inset-0 bg-[url('/left-bg.png')] bg-cover bg-center opacity-10 md:opacity-20"></div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-4">
              Welcome to <span className="text-blue-600">JFit</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Transform your fitness journey with personalized workouts and real-time progress tracking.
            </p>
            {/* Key Features */}
            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Customized workout plans
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Progress tracking and analytics
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Community support and engagement
              </li>
            </ul>
            <Link href="/landingpage/login">
              <button className="mt-8 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">
                Log in
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section with Images */}
        <div className="relative w-full md:w-1/2 flex justify-center items-center mt-12 md:mt-0">
          {/* Desktop Image */}
          <Image
            src="/desktop.png"
            alt="Desktop App Preview"
            width={1600}
            height={1200}
            className="w-full max-w-[600px] md:max-w-[700px] rounded-lg shadow-xl"
          />
          {/* Mobile Image */}
          <Image
            src="/mobile.png"
            alt="Mobile App Preview"
            width={500}
            height={1000}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-1/3 max-w-[150px] md:max-w-[200px] rounded-lg shadow-2xl rotate-6"
          />
        </div>
      </header>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 w-full mt-auto">
        <div className="flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-12 gap-6 text-gray-400">
          {/* Contact Information */}
          <div className="text-center md:text-left w-full md:w-auto">
            <p className="font-semibold text-white">Contact Us</p>
            <p>Email: support@jfit.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start w-full md:w-auto">
            <Link href="/privacy-policy" className='hover:text-white'>
              Privacy Policy
            </Link>
            <Link href="/terms" className='hover:text-white'>
              Terms of Service
            </Link>
            <Link href="/contact" className='hover:text-white'>
              Contact
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 w-full md:w-auto justify-center md:justify-start">
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-white">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-white">
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
