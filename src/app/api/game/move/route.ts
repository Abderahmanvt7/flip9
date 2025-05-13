import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { CardState, GameState, GameResponse } from '@/app/types/game';

export async function POST(request: Request) {
  try {
    const { gameId, playerId, cardIndex } = await request.json();

    if (!gameId || playerId === undefined || cardIndex === undefined) {
      return NextResponse.json(
        { error: 'Game ID, player ID, and card index are required' },
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

    // Check if game is active
    if (gameState.status !== 'active') {
      return NextResponse.json(
        { error: 'Game is not active' },
        { status: 400 }
      );
    }

    // Check if it's the player's turn
    const isPlayerOne = playerId === 1 && gameState.currentPlayer === 1;
    const isPlayerTwo = playerId === 2 && gameState.currentPlayer === 2;

    if (!isPlayerOne && !isPlayerTwo) {
      return NextResponse.json(
        { error: "It's not your turn" },
        { status: 400 }
      );
    }

    // Check if card is already flipped or matched
    if (
      gameState.cards[cardIndex].isFlipped ||
      gameState.cards[cardIndex].isMatched
    ) {
      return NextResponse.json(
        { error: 'Card is already flipped or matched' },
        { status: 400 }
      );
    }

    // Flip the card
    gameState.cards[cardIndex].isFlipped = true;

    const flippedValue = gameState.cards[cardIndex].value;
    let gameEnded = false;

    // Check if correct card was flipped
    if (flippedValue === gameState.currentTarget) {
      // Correct flip
      if (gameState.currentTarget === 9) {
        // Game won
        gameState.cards = gameState.cards.map((card: CardState) => ({
          ...card,
          isMatched: card.isFlipped ? true : card.isMatched,
        }));

        gameState.status = 'completed';
        // Make sure winner is always a valid string
        const winnerName =
          gameState.currentPlayer === 1
            ? gameState.hostPlayer
            : gameState.guestPlayer || 'Player 2';
        gameState.winner = winnerName;
        gameEnded = true;
      } else {
        // Continue turn
        gameState.currentTarget += 1;
      }
    } else {
      // Incorrect flip, update to be handled by frontend timeout
      gameState.incorrectCard = cardIndex;
      gameState.currentTarget = 1;
      gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    }

    gameState.lastUpdated = Date.now();

    // Save updated game state
    await kv.set(`game:${gameId}`, JSON.stringify(gameState));

    const response: GameResponse = { gameState, gameEnded };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing move:', error);
    return NextResponse.json(
      { error: 'Failed to process move' },
      { status: 500 }
    );
  }
}
