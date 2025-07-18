'use client';

import { useState } from 'react';

interface WelcomeScreenProps {
  onStartGame: (player1: string) => void;
}

export default function WelcomeScreen({ onStartGame }: WelcomeScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setError('');
    onStartGame(playerName.trim());
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
          Flip in Order
        </h1>

        <div className='text-center mb-6'>
          <p className='text-gray-600'>
            Challenge your friend to match the numbers in order from 1 to 9
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='playerName'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Your Name
            </label>
            <input
              type='text'
              id='playerName'
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter your name'
            />
          </div>
          {error && <p className='text-red-500 text-sm'>{error}</p>}
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200'
          >
            Create Game
          </button>
        </form>
      </div>
    </div>
  );
}
