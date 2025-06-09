# System Architecture

## Core Architecture

### 1. Application Flow
```
HTTP Request → API Gateway → Lambda Handler → Express Router → Controller → Service → Repository → Database
                                                                   ↑              ↓
                                                                   └← Middleware ←┘
```

### 2. Key Components

#### Base Components
- **BaseController**: Abstract class providing common CRUD operations and request/response handling
- **BaseRouter**: Handles route registration and middleware chaining with automatic path prefixing
- **BaseService**: Implements common service layer logic and error handling
- **BaseRepository**: Provides common database operations and query building

#### Module Structure
Each feature module (e.g., User, Health) follows this structure:
```
modules/
  {module-name}/
    controller/    # Handles HTTP requests/responses
    service/       # Business logic
    router/        # Route definitions
    dto/           # Data Transfer Objects
    entities/      # TypeORM entities
    interfaces/    # TypeScript interfaces
    __tests__/     # Module-specific tests
```

### 3. Dependency Injection
- Uses **TypeDI** for dependency injection
- All services, controllers, and repositories are registered in the DI container
- Enables easy testing through dependency injection

### 4. Error Handling
- Centralized error handling middleware
- Custom error classes for different error types
- Consistent error response format

## Design Patterns

### 1. Repository Pattern
- Abstracts data access layer
- Makes it easy to switch between different data sources
- Improves testability

### 2. Dependency Injection
- Promotes loose coupling
- Simplifies unit testing
- Improves code maintainability

### 3. Middleware Pattern
- Handles cross-cutting concerns (auth, logging, validation)
- Composable and reusable
- Easy to add/remove functionality

## AWS Lambda Integration

### 1. Serverless Architecture
- **API Gateway**: Handles HTTP requests and routes to Lambda
- **Lambda**: Runs the Express application
- **RDS/Other**: Database connection pooling and management

### 2. Cold Start Optimization
- Connection pooling for database
- Warm-up strategies
- Proper error handling for cold starts

## Best Practices

### Code Organization
- Feature-based folder structure
- Clear separation of concerns
- Consistent naming conventions

### Testing
- Unit tests for services and utilities
- Integration tests for API endpoints
- Mock external dependencies

### Performance
- Connection pooling for database
- Proper error handling and retries
- Caching where appropriate

## Monitoring and Observability
- Structured logging
- Request tracing
- Health check endpoints
- System metrics collection