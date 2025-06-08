# Node.js TypeScript AWS Lambda Starter

A minimal starter project for building Node.js TypeScript applications with AWS Lambda and API Gateway.

## Features

- TypeScript support
- AWS Lambda with API Gateway integration
- Local development server with hot-reload
- Environment configuration
- Health check endpoint
- Modular architecture
- ESLint and Prettier for code quality

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- AWS CLI (for deployment)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nodejs-starter.git
   cd nodejs-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start the server at `http://localhost:3000`

5. **Test the health check endpoint**
   ```bash
   curl http://localhost:3000/health
   ```

## Project Structure

```
src/
├── handlers/         # Request handlers
│   └── health.ts     # Health check handler
├── libs/             # Shared libraries
├── middleware/       # Express middleware
├── models/           # Data models
├── routes/           # Route definitions
│   └── index.ts      # Main router configuration
├── utils/            # Utility functions
├── app.ts            # Main Lambda handler
├── bootstrap.ts      # Application bootstrap
└── local.ts          # Local development server
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Watch for changes and compile
- `npm start` - Build and run the application
- `npm run dev` - Start the development server with hot-reload
- `npm test` - Run tests
- `npm run lint` - Lint the codebase
- `npm run clean` - Remove the dist directory

## Deployment

### Prerequisites

1. Install AWS CLI and configure your credentials:
   ```bash
   aws configure
   ```

2. Install the Serverless Framework:
   ```bash
   npm install -g serverless
   ```

### Deploy to AWS Lambda

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy using Serverless Framework:
   ```bash
   serverless deploy
   ```

## Environment Variables

Copy `.env.example` to `.env` and update the values as needed.

```env
NODE_ENV=development
PORT=3000

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## License

MIT
# nodejs-starter
