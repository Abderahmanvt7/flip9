'use client';

import { CardState } from '@/app/types/game';

interface CardProps extends Omit<CardState, 'value'> {
  value: number;
  onClick: () => void;
}

export default function Card({
  value,
  isFlipped,
  isMatched,
  onClick,
}: CardProps) {
  return (
    <div
      className={`card-container relative w-24 h-24 cursor-pointer ${
        isMatched ? 'pointer-events-none' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full transition-all duration-500 ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        } [transform-style:preserve-3d]`}
      >
        {/* Card Back (visible by default) */}
        <div className='absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg [backface-visibility:hidden]'>
          <div className='w-full h-full flex items-center justify-center'>
            <div className='w-12 h-12 bg-white/20 rounded-full'></div>
          </div>
        </div>

        {/* Card Front (hidden by default, visible when flipped) */}
        <div className='absolute inset-0 w-full h-full bg-white rounded-lg shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]'>
          <div className='w-full h-full flex items-center justify-center'>
            <span className='text-4xl font-bold text-gray-800'>{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
