'use client';

import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameBoard from './components/GameBoard';
import GameOverModal from './components/GameOverModal';

export default function Home() {
  const [gameState, setGameState] = useState<
    'welcome' | 'playing' | 'gameOver'
  >('welcome');
  const [players, setPlayers] = useState<{
    player1: string;
    player2: string;
  } | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const handleStartGame = (player1: string, player2: string) => {
    setPlayers({ player1, player2 });
    setGameState('playing');
  };

  const handleGameEnd = (winner: string) => {
    setWinner(winner);
    setGameState('gameOver');
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setWinner(null);
  };

  return (
    <main>
      {gameState === 'welcome' && (
        <WelcomeScreen onStartGame={handleStartGame} />
      )}

      {gameState === 'playing' && players && (
        <GameBoard
          player1={players.player1}
          player2={players.player2}
          onGameEnd={handleGameEnd}
        />
      )}

      {gameState === 'gameOver' && winner && (
        <GameOverModal winner={winner} onPlayAgain={handlePlayAgain} />
      )}
    </main>
  );
}
