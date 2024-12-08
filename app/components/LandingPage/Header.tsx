"use client";

import Image from "next/image";
import Navbar from "./LandingPageNav";
import Card from "./Card/Card"
import { motion, useScroll } from 'framer-motion'
import { useEffect, useRef } from "react";
import Lenis from '@studio-freight/lenis'

export default function HeroSection() {
  const cards = [
    {
      title: "Easy Workout Logging",
      description: "Super easy workout logging to keep track of your progress!",
      image: "/pwa-logo.png"
    },
    {
      title: "Nutrition Guidance",
      description: "Get detailed meal plans and track your macros easily!",
      image: "/pwa-logo.png"
    },
    {
      title: "Community Challenges",
      description: "Stay motivated with group events and challenges.",
      image: "/pwa-logo.png"
    },
    {
      title: "Advanced Analytics",
      description: "Dive deep into your performance with comprehensive analytics.",
      image: "/pwa-logo.png"
    },
    // Add more cards as needed
  ];

  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  useEffect(() => {
    const lenis  = new Lenis()
  
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf)
    }
  
    requestAnimationFrame(raf);
  }, [])


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
                className="w-[70vw] max-w-[900px] rounded-lg shadow-2xl"
              />
            </div>

            {/* Mobile Image */}
            <div className="relative">
              <Image
                src="/mobile.png"
                alt="Mobile App Preview"
                width={500}
                height={1000}
                className="w-[30vw] max-w-[250px] rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION: Fixed Navbar & Stacking Cards */}
      <section
        ref={container}
        id="process"
        className="relative flex flex-col text-center min-h-[500vh]"
        style={{
          background: 'linear-gradient(to top, var(--background-secondary), var(--background))',
          color: 'var(--primary-text)'
        }}
      >
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

        </section>
    </div>
  );
}