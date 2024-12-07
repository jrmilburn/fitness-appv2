'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import EmbeddedCheckoutButton from '../components/Stripe/EmbeddedCheckoutForm';
import HeroSection from '../components/LandingPage/Header';

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userCount, setUserCount] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);

  // Redirect if session is available
  useEffect(() => {
    if (session?.user) {
      router.push('/workouts/current');
    }
  }, [session, router]);

  // Fetch user count
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/count`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    .then(data => setUserCount(data.count))
    .catch(error => console.error('Error fetching user count:', error));
  }, []); // Run only once on component mount

  // Animate the count-up effect with 1.5s delay
  useEffect(() => {
    let animationFrameId;
    let startTime;
    let delayTimeout;
    const duration = 800; // Adjusted duration for faster animation

    // Ease-out cubic function
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCount = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const rawProgress = Math.min(progress / duration, 1);
      const easedProgress = easeOutCubic(rawProgress);
      const currentCount = Math.floor(easedProgress * userCount);
      setDisplayedCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(userCount); // Ensure it finishes at the exact count
      }
    };

    if (userCount > 0) {
      delayTimeout = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animateCount);
      }, 1500); // 1.5 seconds delay
    }

    // Cleanup function
    return () => {
      if (delayTimeout) {
        clearTimeout(delayTimeout);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [userCount]);

  return (
    <div className='w-full'>
    <HeroSection />
    </div>
  );
}
