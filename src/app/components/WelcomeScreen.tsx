'use client';

import { useState } from 'react';

interface WelcomeScreenProps {
  onStartGame: (player1: string) => void;
  onJoinByCode: (playerName: string, gameCode: string) => void;
}

export default function WelcomeScreen({
  onStartGame,
  onJoinByCode,
}: WelcomeScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setError('');
    onStartGame(playerName.trim());
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!gameCode.trim()) {
      setError('Please enter the game code');
      return;
    }

    if (gameCode.trim().length !== 6) {
      setError('Game code must be 6 digits');
      return;
    }

    setError('');
    onJoinByCode(playerName.trim(), gameCode.trim());
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

        {/* Tab buttons */}
        <div className='flex mb-6 bg-gray-100 rounded-lg p-1'>
          <button
            onClick={() => {
              setActiveTab('create');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Create Game
          </button>
          <button
            onClick={() => {
              setActiveTab('join');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'join'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Join Game
          </button>
        </div>

        {activeTab === 'create' && (
          <form onSubmit={handleCreateGame} className='space-y-6'>
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
        )}

        {activeTab === 'join' && (
          <form onSubmit={handleJoinGame} className='space-y-6'>
            <div>
              <label
                htmlFor='joinPlayerName'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Your Name
              </label>
              <input
                type='text'
                id='joinPlayerName'
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter your name'
              />
            </div>
            <div>
              <label
                htmlFor='gameCode'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Game Code
              </label>
              <input
                type='text'
                id='gameCode'
                value={gameCode}
                onChange={(e) =>
                  setGameCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-wider'
                placeholder='123456'
                maxLength={6}
              />
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button
              type='submit'
              className='w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200'
            >
              Join Game
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
