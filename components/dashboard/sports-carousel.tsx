"use client";

import React, { useState } from "react";

interface SportsCarouselProps {
  items: React.ReactNode[];
}

const SportsCarousel: React.FC<SportsCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="flex-none w-full">
              {item}
            </div>
          ))}
        </div>
      </div>
      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 z-10 shadow-md transition-all duration-200"
      >
        <span className="text-lg">&#10094;</span>{" "}
        {/* Unicode for left chevron */}
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 z-10 shadow-md transition-all duration-200"
      >
        <span className="text-lg">&#10095;</span>{" "}
        {/* Unicode for right chevron */}
      </button>
    </div>
  );
};

export default SportsCarousel;
