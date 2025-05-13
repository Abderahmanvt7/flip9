import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv';
import { CardState, GameState, GameResponse } from '@/app/types/game';

// Create a new game session
export async function POST(request: Request) {
  try {
    const { hostPlayer } = await request.json();

    if (!hostPlayer) {
      return NextResponse.json(
        { error: 'Host player name is required' },
        { status: 400 }
      );
    }

    const gameId = uuidv4();
    const gameState: GameState = {
      id: gameId,
      status: 'waiting', // waiting, active, completed
      hostPlayer,
      guestPlayer: null,
      currentPlayer: 1,
      currentTarget: 1,
      cards: generateShuffledCards(),
      lastUpdated: Date.now(),
    };

    // Store game state in KV store
    await kv.set(`game:${gameId}`, JSON.stringify(gameState));
    await kv.expire(`game:${gameId}`, 60 * 60); // Expire after 1 hour

    const response: GameResponse = { gameId, gameState };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

// Get a game session
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    const gameStateStr = await kv.get(`game:${gameId}`);

    if (!gameStateStr) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Make sure gameStateStr is a string before parsing
    let gameState: GameState;
    if (typeof gameStateStr === 'string') {
      gameState = JSON.parse(gameStateStr) as GameState;
    } else {
      gameState = gameStateStr as GameState;
    }

    return NextResponse.json(gameState);
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game state' },
      { status: 500 }
    );
  }
}

// Helper function to generate shuffled cards
function generateShuffledCards(): CardState[] {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);

  return shuffled.map((value) => ({
    value,
    isFlipped: false,
    isMatched: false,
  }));
}
