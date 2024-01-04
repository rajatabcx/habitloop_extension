import React from 'react';

const size = 200;
const strokeWidth = 35;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

export default function timer({ percentage }) {
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        stroke='#E79548'
        fill='none'
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={`${circumference} ${circumference}`}
        className='fill-transparent stroke-[#ddd]'
        {...{ strokeWidth }}
      ></circle>
      <circle
        stroke='#E79548'
        fill='none'
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={`${circumference} ${circumference}`}
        className='fill-transparent stroke-[#E79548]'
        {...{ strokeWidth }}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      ></circle>
    </svg>
  );
}
