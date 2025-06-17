# Module System

The module system provides a structured way to organize application code into cohesive blocks of functionality. It leverages dependency injection to manage dependencies between components and ensures proper initialization order.

## Core Concepts

### 1. Module Definition

A module is defined using the `@Module` decorator, which accepts the following configuration:

```typescript
interface ModuleMetadata {
    // Core components
    controllers?: Type<any>[];     // Request handlers
    services?: Type<any>[];        // Business logic
    repositories?: Type<any>[];    // Data access
    routers?: Type<IRouter>[];      // Route definitions
    
    // Module composition
    imports?: Type<any>[];         // Other modules to import
    exports?: (string | symbol | Function)[]; // Components to expose
    
    // Lifecycle hooks
    onInit?: () => Promise<void>;  // Called after module initialization
    onDestroy?: () => Promise<void>; // Called before application shutdown
}
```

### 2. Module Lifecycle

1. **Registration**: Modules are registered with the `ModuleLoader`
2. **Initialization**: Components are created in dependency order
3. **Runtime**: Module components handle requests
4. **Destruction**: Cleanup resources during shutdown

## Component Types

### 1. Controllers
- Handle HTTP requests
- Use decorators for routing (`@Get`, `@Post`, etc.)
- Should be thin, delegating business logic to services

### 2. Services
- Contain business logic
- Can depend on repositories and other services
- Should be stateless and thread-safe

### 3. Repositories
- Handle data access
- Extend `BaseRepository` for common operations
- Use TypeORM for database interactions

### 4. Routers
- Define API routes
- Can use decorator-based or traditional route definitions
- Handle middleware and request validation

## Advanced Features

### 1. Dynamic Modules

Create modules with dynamic configuration:

```typescript
@Module({
    // ...
    providers: [
        {
            provide: 'CONFIG_OPTIONS',
            useValue: options,
        },
    ],
})
class ConfigModule {
    static forRoot(options: ConfigOptions): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: 'CONFIG_OPTIONS',
                    useValue: options,
                },
            ],
            exports: ['CONFIG_OPTIONS'],
        };
    }
}
```

### 2. Scoped Providers

Control provider scope:
- `SINGLETON` (default): Single instance for the entire application
- `REQUEST`: New instance for each request
- `TRANSIENT`: New instance for each dependency

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}
```

## Best Practices

1. **Module Organization**
   - Group related functionality
   - Keep modules small and focused
   - Use feature modules to separate concerns

2. **Dependency Management**
   - Depend on abstractions, not implementations
   - Use constructor injection
   - Avoid circular dependencies

3. **Performance**
   - Use singleton scope for stateless services
   - Be mindful of request-scoped dependencies
   - Clean up resources in `onDestroy`

## Example: User Module

```typescript
@Module({
    controllers: [UserController],
    services: [UserService, AuthService],
    repositories: [UserRepository],
    routers: [UserRouter],
    imports: [AuthModule],
    exports: [UserService]
})
export class UserModule {
    async onInit() {
        console.log('UserModule initialized');
    }
    
    async onDestroy() {
        console.log('Cleaning up UserModule');
    }
}
```

## Troubleshooting

### Common Issues

1. **Circular Dependencies**
   - Use forwardRef() for circular dependencies
   - Reconsider module boundaries
   
2. **Missing Dependencies**
   - Check if the provider is registered
   - Verify module imports
   
3. **Scope Mismatch**
   - Ensure scopes are compatible
   - Avoid request-scoped dependencies in singletons

### Debugging

Enable debug logging:
```typescript
Container.set({
    global: true,
    debug: true
});
```

This module loading system provides a robust foundation for organizing and managing application components while maintaining proper dependency injection and separation of concerns.
