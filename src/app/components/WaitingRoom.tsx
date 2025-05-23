'use client';

import { useState } from 'react';

interface WaitingRoomProps {
  gameId: string;
  gameCode: string;
}

export default function WaitingRoom({ gameId, gameCode }: WaitingRoomProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
          Game Created!
        </h1>

        <div className='space-y-6'>
          <div className='text-center'>
            <p className='text-gray-600 mb-4'>
              Share this game code with your friend:
            </p>
            <div className='relative'>
              <div className='text-center mb-4'>
                <div className='inline-flex items-center bg-blue-50 border-2 border-blue-200 rounded-lg p-4'>
                  <span className='text-3xl font-bold text-blue-800 tracking-wider'>
                    {gameCode}
                  </span>
                </div>
              </div>
              <button
                onClick={copyCodeToClipboard}
                className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                  copySuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copySuccess ? 'Copied!' : 'Copy Game Code'}
              </button>
            </div>
          </div>

          <div className='mt-8'>
            <div className='flex items-center justify-center space-x-2 text-gray-600'>
              <div className='inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600'></div>
              <p>Waiting for your friend to join...</p>
            </div>
          </div>

          <div className='mt-4 text-center text-sm text-gray-500'>
            <p>
              Your friend can join by entering this game code on the main page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
