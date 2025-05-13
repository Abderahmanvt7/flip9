'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WelcomeScreen from './components/WelcomeScreen';
import GameBoard from './components/GameBoard';
import GameOverModal from './components/GameOverModal';
import JoinGame from '@/app/components/JoinGame';
import WaitingRoom from '@/app/components/WaitingRoom';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Create a client component for the game content
function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');

  const [gameState, setGameState] = useState<
    'welcome' | 'create' | 'join' | 'waiting' | 'playing' | 'gameOver'
  >('welcome');
  const [players, setPlayers] = useState<{
    player1: string;
    player2: string;
  } | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [playerRole, setPlayerRole] = useState<1 | 2 | null>(null);

  // Poll for game state updates
  const { data, error, mutate } = useSWR(
    currentGameId ? `/api/game?gameId=${currentGameId}` : null,
    fetcher,
    { refreshInterval: 2000 } // Poll every 2 seconds
  );

  // Check if we have a game ID in URL params on initial load
  useEffect(() => {
    if (gameId) {
      setCurrentGameId(gameId);
      // Only set to 'join' if we're not already in 'waiting' state (which means we're the host)
      if (gameState === 'welcome') {
        setGameState('join');
      }
    }
  }, [gameId, gameState]);

  // Handle game state updates from polling
  useEffect(() => {
    if (data) {
      // If we're waiting for another player to join
      if (data.status === 'waiting' && gameState === 'waiting') {
        // Keep waiting
      }
      // If a player has joined and game is now active
      else if (
        data.status === 'active' &&
        (gameState === 'waiting' || gameState === 'join')
      ) {
        setPlayers({
          player1: data.hostPlayer,
          player2: data.guestPlayer,
        });
        setGameState('playing');
      }
      // If game is over
      else if (data.status === 'completed' && gameState === 'playing') {
        setWinner(data.winner);
        setGameState('gameOver');
      }
    }
  }, [data, gameState]);

  const handleStartGame = async (player1: string) => {
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostPlayer: player1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const { gameId, gameState } = await response.json();
      setCurrentGameId(gameId);
      setPlayerRole(1); // Host is player 1
      setGameState('waiting'); // Set to waiting first

      // Update URL with game ID (for sharing)
      router.push(`?gameId=${gameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handleJoinGame = async (player2: string) => {
    if (!currentGameId) return;

    try {
      const response = await fetch('/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: currentGameId, guestPlayer: player2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (
          response.status === 400 &&
          errorData.error === 'Host cannot join their own game'
        ) {
          // If the player is the host, show them the waiting room instead
          setGameState('waiting');
          return;
        }
        throw new Error(errorData.error || 'Failed to join game');
      }

      const { gameState } = await response.json();
      setPlayerRole(2); // Guest is player 2
      setPlayers({
        player1: gameState.hostPlayer,
        player2: gameState.guestPlayer,
      });

      setGameState('playing');
      mutate(); // Refresh game state
    } catch (error) {
      console.error('Error joining game:', error);
      // Handle other errors appropriately
      alert(error instanceof Error ? error.message : 'Failed to join game');
    }
  };

  const handleCardFlip = async (cardIndex: number) => {
    if (!currentGameId || !playerRole) return;

    try {
      const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: currentGameId,
          playerId: playerRole,
          cardIndex,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to make move');
      }

      mutate(); // Refresh game state
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  const handleResetFlippedCards = async () => {
    if (!currentGameId) return;

    try {
      const response = await fetch('/api/game/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: currentGameId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset cards');
      }

      mutate(); // Refresh game state
    } catch (error) {
      console.error('Error resetting cards:', error);
    }
  };

  const handlePlayAgain = () => {
    // Reset game state
    setGameState('welcome');
    setCurrentGameId(null);
    setPlayerRole(null);
    setWinner(null);

    // Remove gameId from URL
    router.push('/');
  };

  return (
    <main>
      {gameState === 'welcome' && (
        <WelcomeScreen onStartGame={handleStartGame} />
      )}

      {gameState === 'join' && <JoinGame onJoinGame={handleJoinGame} />}

      {gameState === 'waiting' && currentGameId && (
        <WaitingRoom gameId={currentGameId} />
      )}

      {gameState === 'playing' && players && data && (
        <GameBoard
          player1={players.player1}
          player2={players.player2}
          onGameEnd={() => {}}
          gameData={data}
          playerRole={playerRole}
          onCardFlip={handleCardFlip}
          onResetCards={handleResetFlippedCards}
        />
      )}

      {gameState === 'gameOver' && winner && (
        <GameOverModal winner={winner} onPlayAgain={handlePlayAgain} />
      )}
    </main>
  );
}

// Main page component
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}
