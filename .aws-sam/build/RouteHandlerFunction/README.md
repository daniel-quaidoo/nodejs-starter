# Node.js TypeScript Starter with AWS Lambda

A production-ready Node.js TypeScript starter with Express, TypeORM, and TypeDI, designed for AWS Lambda. This project follows best practices for building scalable and maintainable serverless applications with a focus on clean architecture and developer experience.

## 🚀 Features

- **Core**
  - 🚀 **Express.js** with TypeScript on AWS Lambda
  - 🏗️ **Modular Architecture** with clear separation of concerns
  - 📦 **Dependency Injection** with TypeDI
  - 🔒 **Request ID** for end-to-end request tracing
  - ⚡ **Serverless** ready with AWS Lambda

- **Database**
  - 🗃️ **TypeORM** for database interactions
  - 🔄 **Migrations** support
  - 🧪 **Repository Pattern** implementation

- **API**
  - 🌐 **RESTful** API design
  - ✅ **Input Validation** with Joi
  - 🔄 **Base Router & Controller** for consistent routing

- **Development**
  - 🛠️ **Hot-reload** with ts-node-dev
  - 📊 **Structured Logging** with request tracing
  - 🧪 **Testing** with Jest
  - 🧹 **Code Quality** with ESLint & Prettier
  - 🐳 **Docker** ready

- **Monitoring & Operations**
  - 🩺 **Health Check** endpoints (`/health`, `/liveness`, `/readiness`)
  - 📈 **System Metrics** monitoring
  - 🔍 **Request Logging** middleware
  - 🛡️ **CORS** and security headers with Helmet

## 🛠 Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL (or your preferred database)
- Docker (optional, for containerized development)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nodejs-starter.git
   cd nodejs-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. **Run database migrations**
   ```bash
   npm run migrate:run
   # or
   yarn migrate:run
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The server will be available at `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── __tests__/             # Test files
│   ├── integration/       # Integration tests
│   └── unit/             # Unit tests
├── config/               # Configuration files
├── core/                 # Core application code
│   ├── common/           # Common utilities and types
│   │   ├── controller/   # Base controller
│   │   ├── interfaces/   # Core interfaces
│   │   ├── middleware/   # Common middleware
│   │   └── router/      # Base router implementation
│   ├── db/               # Database configuration
│   └── types/            # TypeScript type definitions
├── modules/              # Feature modules
│   ├── health/           # Health check module
│   │   ├── controller/   # Health check controllers
│   │   ├── service/      # Health check services
│   │   ├── router/       # Health check routes
│   │   └── interfaces/   # Health check interfaces
│   └── user/             # User module
│       ├── controller/   # User controllers
│       ├── service/      # User services
│       ├── router/       # User routes
│       ├── dto/          # Data transfer objects
│       ├── entities/     # TypeORM entities
│       └── interfaces/   # User interfaces
└── shared/               # Shared utilities and helpers
    ├── decorators/      # Custom decorators
    ├── errors/         # Custom error classes
    └── utils/          # Utility functions
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nodejs-lambda-starter.git
   cd nodejs-lambda-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. **Run database migrations**
   ```bash
   npm run migrate:run
   # or
   yarn migrate:run
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The server will be available at `http://localhost:3000`

## 🚀 Deployment

### AWS Lambda Deployment

1. **Install AWS SAM CLI**
   ```bash
   brew tap aws/tap
   brew install aws-sam-cli
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Deploy using SAM**
   ```bash
   sam deploy --guided
   ```

### Local Development with SAM

1. **Start local API Gateway**
   ```bash
   sam local start-api
   ```

## 📡 API Endpoints

### Health Check
- `GET /health` - Application health status
- `GET /liveness` - Liveness probe
- `GET /readiness` - Readiness probe

## 🧪 Testing

Run tests with coverage:
```bash
npm test
# or
yarn test
```

Run in watch mode:
```bash
npm run test:watch
# or
yarn test:watch
```

## 🏗️ Build

Build the application:
```bash
npm run build
# or
yarn build
```

## 🐳 Docker

Build the Docker image:
```bash
docker build -t nodejs-starter .
```

Run the container:
```bash
docker run -p 3000:3000 nodejs-starter
```
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000/api`

6. **Run tests**
   ```bash
   npm test
   ```

## Project Structure

```
src/
├── config/               # Configuration files
├── core/                 # Core application logic
│   ├── common/           # Common utilities and base classes
│   ├── db/               # Database configuration and migrations
│   └── middleware/       # Express middleware
├── modules/              # Feature modules
│   ├── health/           # Health check module
│   └── user/             # User module
└── shared/               # Shared utilities and types
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint code
- `npm run migrate:generate` - Generate new migration
- `npm run migrate:run` - Run pending migrations
- `npm run migrate:revert` - Revert last migration

## Environment Variables

See `.env.example` for all available environment variables.

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Deployment

### With Docker

```bash
docker-compose up --build
```

### Without Docker

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
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