"use client";

import Image from "next/image";
import Navbar from "./LandingPageNav";
import Card from "./Card/Card"
import { useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from "react";
import Lenis from '@studio-freight/lenis'
import { motion } from 'framer-motion'

export default function HeroSection() {

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [circleStyle, setCircleStyle] = useState({});

  const cards = [
    {
        title: "Easy Workout Logging",
        description: "Effortlessly log every workout, set, and rep with an intuitive interface designed to streamline tracking. Stay on top of your progress with detailed insights into your performance, ensuring you’re always moving closer to your fitness goals.",
        image: "/tracking.webp",
        backgroundColor: "#FFDEE9" // Soft pink gradient
    },
    {
        title: "Advanced Workout Builder",
        description: "Create personalized workout routines with our highly customizable builder. Whether you’re training for strength, endurance, or overall fitness, tailor every aspect of your program, from exercises to rest periods, to build a workout plan that suits your unique goals.",
        image: "/create-program.webp",
        backgroundColor: "#B5F3E1" // Mint green gradient
    },
    {
        title: "Community Engagement",
        description: "Connect with like-minded fitness enthusiasts through the app’s integrated social platform. Join group challenges, request coaching advice, and follow your friends' progress to stay motivated and inspired while building a supportive fitness community.",
        image: "/community-engagement.webp",
        backgroundColor: "#D9E4FF" // Soft blue gradient
    },
    {
        title: "Automatic Volume Regulation",
        description: "Experience smarter training with JFit’s custom volume autoregulation. Adjust exercise intensity and volume automatically based on your feedback and performance trends, ensuring optimal progress without overtraining or stagnation.",
        image: "/regulation.webp",
        backgroundColor: "#FFD9B5" // Warm peach gradient
    },
    // Add more cards as needed
];

  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  const textColor = useTransform(scrollYProgress, [0.95, 1], ["#000", "#fff"]);

  useEffect(() => {
    const lenis  = new Lenis()
  
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf)
    }
  
    requestAnimationFrame(raf);
  }, [])

  const handleSignUp = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // X-coordinate relative to the button
    const y = e.clientY - rect.top;  // Y-coordinate relative to the button

    // Set the transform origin based on the click position
    setCircleStyle({
      top: `${e.clientY}px`,
      left: `${e.clientX}px`,
      transformOrigin: `${x}px ${y}px`,
    });

    setIsSignUpOpen(true);
  };

  const closeSignUp = () => {
    setIsSignUpOpen(false);
  };


  return (
    <div className="relative" style={{ background: 'var(--background)' }}>
      {/* FIRST SECTION (Full height hero) */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              linear-gradient(to bottom, var(--background) 0%, var(--background-secondary) 100%),
              radial-gradient(circle at center, var(--highlight) 0%, transparent 70%)
            `,
            backgroundBlendMode: "soft-light"
          }}
        ></div>

        {/* Hero Text */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-xl">
          <h1 
            className="text-3xl md:text-5xl font-semibold mb-4"
            style={{ color: 'var(--primary-text)' }}
          >
            Your Path to a Healthier Lifestyle
          </h1>
          <p
            className="text-base md:text-lg mb-12"
            style={{ color: 'var(--secondary-text)' }}
          >
            Track your progress, enjoy personalized workouts, and achieve your fitness goals—anytime, anywhere.
          </p>
        </div>

        {/* App Images Container */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* Desktop Image */}
            <div className="relative">
              <Image
                src="/desktop.png"
                alt="Desktop App Preview"
                width={1600}
                height={1200}
                className="w-[70vw] max-w-[900px] rounded-lg shadow-2xl hover:scale-105 transition-all duration-500"
              />
            </div>

            {/* Mobile Image */}
            <div className="relative">
              <Image
                src="/mobile.png"
                alt="Mobile App Preview"
                width={500}
                height={1000}
                className="w-[30vw] max-w-[250px] rounded-lg shadow-2xl hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION: Fixed Navbar & Stacking Cards */}
      <section
        ref={container}
        id="process"
        className="relative flex flex-col text-center"
        style={{
          background: 'linear-gradient(to top, var(--background-secondary), var(--background))',
          color: 'var(--primary-text)'
        }}
      >

        <motion.h2 
          style={{ color: textColor }}
          className="top-[0%] text-5xl inter-bold sticky p-8">Key Features</motion.h2>

        {/* Navbar fixed at the top-right corner */}
        <div className="fixed top-4 right-4 z-20">
          <Navbar />
        </div>

            {cards.map((card, index) => {
                const targetScale = 1 - (cards.length - index) * 0.05;
                return <Card 
                    key={index}
                    i={index}
                    card={card}
                    range={[index * 0.25, 1]}
                    targetScale={targetScale}
                    progress={scrollYProgress}/>
            })}

          <motion.div
            className="bg-black h-[100vh] w-full"
          ></motion.div>



        </section>
        <div className="sticky top-[80%] bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Interested?</h2>
              <button
                className="relative bg-white text-indigo-600 font-semibold text-lg px-6 py-3 rounded-full shadow-lg transform transition duration-300 hover:bg-indigo-600 hover:text-white hover:scale-105 active:scale-95 active:shadow-none"
                onClick={handleSignUp}
              >
                Sign Up Now
                <p className="absolute top-0 right-0 text-sm text-primary-text translate-x-[100%]"><em>(There&apos;s a free version)</em></p>
              </button>
            </div>

            {isSignUpOpen && (
              <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ${isSignUpOpen ? '' : 'rounded-full'} transition-all duration-500`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-lg p-8 shadow-2xl w-[90%] md:w-[50%]"
                >
                  <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                  <form>
                    <label className="block mb-2">
                      <span className="text-gray-700">Email</span>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring focus:ring-indigo-300"
                        required
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="text-gray-700">Password</span>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring focus:ring-indigo-300"
                        required
                      />
                    </label>
                    <div className="flex justify-between items-center">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
                      >
                        Create Account
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 underline hover:text-gray-700"
                        onClick={closeSignUp}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
      )}
    </div>
  );
}