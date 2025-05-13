export interface CardState {
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  hostPlayer: string;
  guestPlayer: string | null;
  currentPlayer: 1 | 2;
  currentTarget: number;
  cards: CardState[];
  lastUpdated: number;
  incorrectCard?: number;
  winner?: string;
}

export interface GameResponse {
  gameId?: string;
  gameState?: GameState;
  error?: string;
  gameEnded?: boolean;
}
