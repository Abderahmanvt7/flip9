'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

interface GameBoardProps {
  player1: string;
  player2: string;
  onGameEnd: (winner: string) => void;
}

interface CardState {
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function GameBoard({
  player1,
  player2,
  onGameEnd,
}: GameBoardProps) {
  const [cards, setCards] = useState<CardState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create array of numbers 1-9 and shuffle them
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);

    setCards(
      shuffled.map((value) => ({
        value,
        isFlipped: false,
        isMatched: false,
      }))
    );

    setCurrentPlayer(1);
    setCurrentTarget(1);
    setFlippedCards([]);
    setIsGameOver(false);
  };

  const handleCardClick = (index: number) => {
    if (isGameOver || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const flippedValue = cards[index].value;
    const newFlippedCards = [...flippedCards, index];

    if (flippedValue === currentTarget) {
      // Correct flip
      if (currentTarget === 9) {
        // Game won - mark all flipped cards as matched
        const updatedCards = newCards.map((card, i) => ({
          ...card,
          isMatched: card.isFlipped ? true : card.isMatched,
        }));
        setCards(updatedCards);
        setIsGameOver(true);
        onGameEnd(currentPlayer === 1 ? player1 : player2);
      } else {
        // Continue turn
        setCurrentTarget(currentTarget + 1);
        setFlippedCards(newFlippedCards);
      }
    } else {
      // Incorrect flip
      setTimeout(() => {
        // Flip all cards back
        const resetCards = cards.map((card, i) => ({
          ...card,
          isFlipped: newFlippedCards.includes(i) ? false : card.isFlipped,
        }));
        setCards(resetCards);
        setFlippedCards([]);
        setCurrentTarget(1);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }, 1000);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <h2 className='text-2xl font-bold text-center mb-4'>
            {currentPlayer === 1 ? player1 : player2}'s Turn
          </h2>
          <p className='text-center text-gray-600'>
            Find number: {currentTarget}
          </p>
        </div>

        <div className='grid grid-cols-3 gap-4 justify-items-center'>
          {cards.map((card, index) => (
            <Card
              key={index}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        <div className='mt-8 text-center'>
          <button
            onClick={initializeGame}
            className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200'
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
