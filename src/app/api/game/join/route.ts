import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { GameState, GameResponse } from '@/app/types/game';

export async function POST(request: Request) {
  try {
    const { gameId, gameCode, guestPlayer } = await request.json();

    if ((!gameId && !gameCode) || !guestPlayer) {
      return NextResponse.json(
        { error: 'Game ID or game code and guest player name are required' },
        { status: 400 }
      );
    }

    let actualGameId = gameId;

    // If gameCode is provided, resolve it to gameId
    if (gameCode && !gameId) {
      const resolvedGameId = await kv.get(`code:${gameCode}`);
      if (!resolvedGameId) {
        return NextResponse.json(
          { error: 'Invalid game code' },
          { status: 404 }
        );
      }
      actualGameId = resolvedGameId as string;
    }

    // Get current game state
    const gameStateStr = await kv.get(`game:${actualGameId}`);

    if (!gameStateStr) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Parse game state safely
    let gameState: GameState;
    if (typeof gameStateStr === 'string') {
      gameState = JSON.parse(gameStateStr) as GameState;
    } else {
      gameState = gameStateStr as GameState;
    }

    // Check if game is still in waiting status
    if (gameState.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Game is no longer accepting players' },
        { status: 400 }
      );
    }

    // Check if the player trying to join is the host
    if (gameState.hostPlayer === guestPlayer) {
      return NextResponse.json(
        { error: 'Host cannot join their own game' },
        { status: 400 }
      );
    }

    // Check if guest player name is same as host player
    if (gameState.hostPlayer === guestPlayer) {
      return NextResponse.json(
        { error: 'Guest player name must be different from host player' },
        { status: 400 }
      );
    }

    // Update game state
    gameState.guestPlayer = guestPlayer;
    gameState.status = 'active';
    gameState.lastUpdated = Date.now();

    // Save updated game state
    await kv.set(`game:${actualGameId}`, JSON.stringify(gameState));

    const response: GameResponse = { gameState };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing join request:', error);
    return NextResponse.json(
      { error: 'Failed to process join request' },
      { status: 500 }
    );
  }
}
