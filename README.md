# Untold Stories Bot

A text adventure Discord bot built with Discord.js that creates collaborative storytelling experiences using OpenAI.

## Features

- Interactive storytelling with AI assistance
- Character creation and management
- Story continuation and collaboration
- Session persistence with SQLite database

## Setup

### Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials:
   ```
   TOKEN=your_discord_bot_token_here
   API_KEY=your_openai_api_key_here
   ```

### Running with Docker (Recommended)

1. **Using Docker Compose** (easiest method):
   ```bash
   docker-compose up -d
   ```

2. **Using Docker directly**:
   ```bash
   # Build the image
   docker build -t untold-stories-bot .
   
   # Run the container
   docker run -d \
     --name untold-stories-bot \
     --env-file .env \
     -v ./data:/app/data \
     untold-stories-bot
   ```

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the bot:
   ```bash
   npm start
   ```

## Docker Commands

- **Start the bot**: `docker-compose up -d`
- **Stop the bot**: `docker-compose down`
- **View logs**: `docker-compose logs -f`
- **Restart the bot**: `docker-compose restart`
- **Update and restart**: 
  ```bash
  docker-compose down
  docker-compose build --no-cache
  docker-compose up -d
  ```

## Data Persistence

The bot uses SQLite for data storage. When running with Docker, the database is stored in the `./data` directory which is mounted as a volume, ensuring your stories and characters persist between container restarts.

## Development

For development, you can run the bot locally:

```bash
npm run dev
```

## Commands

- `/start` - Begin a new story session
- `/profile` - View your character profile
- `/contribute` - Add to the current story
- `/continue` - Let the AI continue the story
- `/summary` - Get a summary of the current story
- `/create-character` - Create a new character
- And more...

## License

UNLICENSED
