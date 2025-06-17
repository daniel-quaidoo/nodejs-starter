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
- **BaseController**: Abstract class providing common CRUD operations, request/response handling, and standardized response formatting
- **BaseRouter**: Handles route registration, middleware chaining, and automatic path prefixing with support for decorator-based routing
- **BaseService**: Implements common service layer logic, transaction management, and error handling
- **BaseRepository**: Provides common database operations, query building, and TypeORM integration
- **BaseEntity**: Base class for all TypeORM entities with common fields and methods
- **BaseDTO**: Base class for Data Transfer Objects with validation decorators

#### Module Structure
Each feature module (e.g., User, Health) follows this structure:
```
modules/
  {module-name}/
    controller/    # Handles HTTP requests/responses
    service/       # Business logic and domain services
    router/        # Route definitions and middleware
    dto/           # Data Transfer Objects with validation
      requests/    # Request DTOs
      responses/   # Response DTOs
    entities/      # TypeORM entities
    interfaces/    # TypeScript interfaces and types
    constants/     # Module-specific constants
    __tests__/     # Unit and integration tests
    index.ts       # Module exports
```

### 3. Dependency Injection
- Uses **TypeDI** for dependency injection
- All services, controllers, and repositories are registered in the DI container
- Enables easy testing through dependency injection

### 4. Error Handling
- Centralized error handling middleware
- Custom error classes for different error types

### 2. Dependency Injection
- TypeDI container for managing dependencies
- Decorator-based dependency injection
- Support for constructor injection
- Scoped and singleton services
- Token-based router registration

### 3. Database
- TypeORM for database operations
- Repository pattern for data access
- Connection pooling for performance
- Transaction support
- Repository registration through module system

### 4. Routing
- Express.js for HTTP handling
- Modular router system with `IModuleRouter` interface
- Route decorators for route definition
- Middleware support
- API prefix configuration
- Route registration through router registry

### 5. Configuration
- Environment-based configuration using ConfigService
- Type-safe configuration access
- Support for different environments (development, production, etc.)

## Best Practices

### Code Organization
- Feature-based folder structure
- Clear separation of concerns
- Consistent naming conventions
- Single responsibility principle
- Dependency injection for loose coupling

### Testing
- Unit tests for services and utilities
- Integration tests for API endpoints
- Mock external dependencies
- Test coverage requirements

### Performance
- Connection pooling for database
- Proper error handling and retries
- Caching where appropriate
- Optimized route registration

### Monitoring and Observability
- Structured logging
- Request tracing
- Health check endpoints
- Error tracking
- Performance metrics

## Key Features

### 1. Module Loading System
- Automatic component registration
- Dependency resolution
- Proper component initialization order
- Error handling for cold starts

### 2. Router System
- Modular route definition
- Route registry for centralized management
- Token-based router identification
- API prefix support
- Route logging and monitoring

### 3. Health Checks
- Comprehensive health monitoring
- Database connectivity checks
- System metrics collection
- Response time measurement
- Status reporting

## Future Considerations

1. **Scalability**
   - Horizontal scaling support
   - Load balancing configuration
   - Caching strategy

2. **Security**
   - Authentication middleware
   - Rate limiting
   - Input validation
   - Security headers

3. **Monitoring**
   - Performance metrics collection
   - Error tracking integration
   - Log aggregation
   - Alerting configuration

4. **CI/CD**
   - Automated testing
   - Code quality checks
   - Deployment automation
   - Version management