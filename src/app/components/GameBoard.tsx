'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { CardState, GameState } from '@/app/types/game';

interface GameBoardProps {
  player1: string;
  player2: string;
  onGameEnd: (winner: string) => void;
  gameData: GameState;
  playerRole: 1 | 2 | null;
  onCardFlip: (cardIndex: number) => void;
  onResetCards: () => void;
}

export default function GameBoard({
  player1,
  player2,
  onGameEnd,
  gameData,
  playerRole,
  onCardFlip,
  onResetCards,
}: GameBoardProps) {
  const [lastMoveTime, setLastMoveTime] = useState<number | null>(null);

  // Monitor game state for incorrect card flips and handle resetting cards
  useEffect(() => {
    if (gameData && gameData.incorrectCard !== undefined) {
      // Set a delay to show the card before resetting
      setTimeout(() => {
        onResetCards();
      }, 1000);
    }
  }, [gameData, onResetCards]);

  // Handle card click for current player only
  const handleCardClick = (index: number) => {
    // Only allow clicks from the current player
    if (gameData.currentPlayer !== playerRole) return;

    // Prevent clicking on already flipped or matched cards
    if (gameData.cards[index].isFlipped || gameData.cards[index].isMatched)
      return;

    // Prevent rapid clicking
    const now = Date.now();
    if (lastMoveTime && now - lastMoveTime < 300) return;
    setLastMoveTime(now);

    // Call the API to flip the card
    onCardFlip(index);
  };

  // Determine if it's this player's turn
  const isMyTurn = gameData.currentPlayer === playerRole;

  // Get the current player's name
  const currentPlayerName = gameData.currentPlayer === 1 ? player1 : player2;

  // Check if game is waiting for the player
  const waitingMessage = isMyTurn
    ? "It's your turn"
    : `Waiting for ${currentPlayerName}'s move...`;

  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <h2 className='text-2xl font-bold text-center mb-4'>
            {currentPlayerName}'s Turn
          </h2>
          <p className='text-center text-gray-600'>
            Find number: {gameData.currentTarget}
          </p>
          <p
            className={`text-center mt-2 font-medium ${
              isMyTurn ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {waitingMessage}
          </p>
        </div>

        <div className='grid grid-cols-3 gap-4 justify-items-center'>
          {gameData.cards.map((card: CardState, index: number) => (
            <Card
              key={index}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        <div className='mt-8 flex justify-center'>
          <div className='bg-white rounded-lg shadow p-4 max-w-xs w-full'>
            <h3 className='text-lg font-semibold mb-2 text-center'>Players</h3>
            <div className='space-y-2'>
              <div
                className={`p-2 rounded ${
                  gameData.currentPlayer === 1 ? 'bg-blue-100' : ''
                }`}
              >
                {player1} {playerRole === 1 ? '(You)' : ''}
              </div>
              <div
                className={`p-2 rounded ${
                  gameData.currentPlayer === 2 ? 'bg-blue-100' : ''
                }`}
              >
                {player2} {playerRole === 2 ? '(You)' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
