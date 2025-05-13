'use client';

import { useState } from 'react';

interface WaitingRoomProps {
  gameId: string;
}

export default function WaitingRoom({ gameId }: WaitingRoomProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const gameUrl = `${window.location.origin}?gameId=${gameId}`;

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl);
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
              Share this link with your friend to start playing:
            </p>
            <div className='relative'>
              <input
                type='text'
                value={gameUrl}
                readOnly
                className='w-full p-3 pr-24 text-sm border border-gray-300 rounded-md bg-gray-50'
              />
              <button
                onClick={copyLinkToClipboard}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md transition-colors duration-200 ${
                  copySuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
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
              Once your friend joins using this link, the game will start
              automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
