import React, { useState, useRef } from "react";

const PullToRefresh = ({ onRefresh, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const pullThreshold = 70; // Minimum pull distance to trigger refresh

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, pullThreshold));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= pullThreshold) {
      onRefresh();
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  return (
    <div
      className="relative overflow-y-scroll w-full h-screen bg-gray-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-Refresh Indicator */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-center ${
          pullDistance > 0 ? "visible" : "invisible"
        }`}
        style={{
          height: `${pullDistance}px`,
        }}
      >
        <div
          className={`text-sm text-gray-600 transition-transform relative ${
            isPulling ? "opacity-100" : "opacity-0"
          }`}
        >
          {pullDistance >= pullThreshold
            ? "Release to refresh"
            : "Pull to refresh"}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transform ${
          isPulling ? `translate-y-${pullDistance}` : "translate-y-0"
        } transition-transform duration-300 z-0 relative flex-grow max-h-screen`}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
