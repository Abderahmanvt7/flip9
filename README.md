# Flip9 - Multiplayer Memory Game

A multiplayer memory card game where players take turns flipping cards in numerical order from 1 to 9. The game allows two players to play together from different devices.

## Features

- Real-time multiplayer gameplay without WebSockets
- Vercel-compatible implementation using Vercel KV as the datastore
- Share a link to invite friends to play
- Mobile-responsive design

## How to Play

1. The first player creates a game and shares the link with a friend
2. The second player joins by clicking the link
3. Players take turns flipping cards, looking for numbers 1 through 9 in sequence
4. If a player flips an incorrect card, their turn ends, and they start again from 1
5. The first player to find 9 wins the game

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel KV (for state management)
- SWR (for data fetching and polling)

## Local Development

First, install dependencies:

```bash
npm install
# or
yarn
```

You'll need Vercel KV for the multiplayer functionality. You can use a local Redis instance for development:

1. Create a new Vercel project and add a KV database
2. Get your KV credentials from the Vercel Dashboard
3. Copy `src/env.local.example` to `.env.local` and add your KV credentials

Then run the development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to play the game locally.

## Deployment

The easiest way to deploy is with Vercel:

1. Push your code to a Git repository
2. Create a new project in Vercel and link it to your repository
3. Add your KV credentials to the Environment Variables in the Vercel dashboard
4. Deploy

## How Multiplayer Works

This game uses a polling-based approach instead of WebSockets for Vercel compatibility:

1. Game state is stored in Vercel KV
2. Players poll for updates to the game state every 2 seconds
3. When a player makes a move, they update the game state in KV
4. The opponent receives the updated state on the next poll

This approach allows for near real-time gameplay without requiring WebSockets, making it compatible with Vercel's serverless architecture.

## License

MIT
