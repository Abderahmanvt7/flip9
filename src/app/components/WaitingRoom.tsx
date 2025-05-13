'use client';

interface WaitingRoomProps {
  gameId: string;
}

export default function WaitingRoom({ gameId }: WaitingRoomProps) {
  // Format game ID for display
  const formattedGameId = gameId.slice(0, 8);
  const gameUrl = `${window.location.origin}?gameId=${gameId}`;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(gameUrl);
    alert('Game link copied to clipboard!');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
          Waiting for Opponent
        </h1>

        <div className='space-y-6'>
          <div className='text-center'>
            <p className='text-gray-600 mb-2'>
              Share this game ID with your friend:
            </p>
            <p className='text-xl font-mono bg-gray-100 p-3 rounded-md'>
              {formattedGameId}
            </p>
          </div>

          <div className='text-center'>
            <p className='text-gray-600 mb-2'>Or share this link:</p>
            <div className='flex items-center justify-center space-x-2'>
              <input
                type='text'
                value={gameUrl}
                readOnly
                className='flex-grow p-2 text-sm border border-gray-300 rounded-md bg-gray-50'
              />
              <button
                onClick={copyLinkToClipboard}
                className='bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-200'
              >
                Copy
              </button>
            </div>
          </div>

          <div className='mt-8 text-center'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600'></div>
            <p className='mt-2 text-gray-600'>
              Waiting for another player to join...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
