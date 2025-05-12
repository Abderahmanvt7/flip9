'use client';

interface GameOverModalProps {
  winner: string;
  onPlayAgain: () => void;
}

export default function GameOverModal({
  winner,
  onPlayAgain,
}: GameOverModalProps) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4'>
        <h2 className='text-3xl font-bold text-center mb-4 text-gray-800'>
          Game Over!
        </h2>
        <p className='text-xl text-center mb-8 text-gray-600'>{winner} wins!</p>
        <button
          onClick={onPlayAgain}
          className='w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200'
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
