import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { CardState, GameState, GameResponse } from '@/app/types/game';

export async function POST(request: Request) {
  try {
    const { gameId } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Get current game state
    const gameStateStr = await kv.get(`game:${gameId}`);

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

    // Reset flipped cards that are not matched
    if (gameState.incorrectCard !== undefined) {
      gameState.cards = gameState.cards.map((card: CardState) => ({
        ...card,
        isFlipped: card.isMatched ? true : false,
      }));

      delete gameState.incorrectCard;
      gameState.lastUpdated = Date.now();

      // Save updated game state
      await kv.set(`game:${gameId}`, JSON.stringify(gameState));
    }

    const response: GameResponse = { gameState };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error resetting cards:', error);
    return NextResponse.json(
      { error: 'Failed to reset cards' },
      { status: 500 }
    );
  }
}
