'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WelcomeScreenProps {
  onStartGame: (player1: string, player2: string) => void;
}

export default function WelcomeScreen({ onStartGame }: WelcomeScreenProps) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!player1.trim() || !player2.trim()) {
      setError('Both player names are required');
      return;
    }

    if (player1.trim() === player2.trim()) {
      setError('Player names must be different');
      return;
    }

    setError('');
    onStartGame(player1.trim(), player2.trim());
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
          Flip in Order
        </h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='player1'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Player 1 Name
            </label>
            <input
              type='text'
              id='player1'
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter Player 1 name'
            />
          </div>
          <div>
            <label
              htmlFor='player2'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Player 2 Name
            </label>
            <input
              type='text'
              id='player2'
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter Player 2 name'
            />
          </div>
          {error && <p className='text-red-500 text-sm'>{error}</p>}
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200'
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
}
