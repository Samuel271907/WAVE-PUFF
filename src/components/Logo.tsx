import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "h-full w-full", showText = true }: LogoProps) {
  const [error, setError] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);

  const CANDIDATES = [
    "https://i.ibb.co/BVYZWTV2/logo.png",
    "https://i.ibb.co/BVYZWTV2/logo.jpg",
    "https://i.ibb.co/BVYZWTV2/image.png",
    "https://i.ibb.co/BVYZWTV2/image.jpg",
    "https://i.ibb.co/BVYZWTV/logo.png",
    "https://i.ibb.co/BVYZWTV/logo.jpg",
    "https://i.ibb.co/jkkRbvLP/logo.jpg"
  ];

  const currentSrc = CANDIDATES[candidateIndex];

  const handleImgError = () => {
    if (candidateIndex < CANDIDATES.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setError(true);
    }
  };

  if (error) {
    // Elegant fallback outline in case the image fails to load
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} text-[#7B52DE]`}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 15C35 15 25 25 25 38C25 45 28 50 33 55L31 80C31 83 34 85 37 85H63C66 85 69 83 69 80L67 55C72 50 75 45 75 38C75 25 65 15 50 15ZM37 77L38 52C39 52 39 51 40 51H60C61 51 61 52 62 52L63 77H37Z" fill="url(#logoPurpleGrad)" />
        <path d="M35 30C42 22 58 22 65 30C58 35 42 35 35 30Z" fill="#A78BFA" />
        <path d="M20 70C25 67 30 72 35 70M65 70C70 67 75 72 80 70" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="logoPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7B52DE" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <img
      src={currentSrc}
      alt="Wave Puff"
      className={`${className} object-cover`}
      referrerPolicy="no-referrer"
      onError={handleImgError}
    />
  );
}
