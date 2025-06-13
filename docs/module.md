# Module Loading System

The module loading system is a core component of the application's dependency injection and component registration mechanism. It provides a structured way to organize and register different types of components (controllers, services, repositories, routers) while maintaining proper dependency injection.

## Core Components

### 1. Module Decorator
The `@Module` decorator is used to define metadata about a module. It accepts an object with the following properties:

```typescript
interface ModuleMetadata {
    controllers?: any[];    // Controllers to register
    services?: any[];       // Services to register
    repositories?: any[];   // Repositories to register
    routers?: any[];        // Routers to register
    imports?: any[];        // Other modules to import
    exports?: any[];        // Components to export
}
```

### 2. ModuleLoader Class
The `ModuleLoader` class is responsible for loading and registering all components defined in a module. It uses TypeDI's container for dependency injection.

## Registration Process

The registration process follows a specific order to ensure proper dependency injection:

1. **Repositories**: Registered first as they often provide data access that other components depend on
2. **Services**: Registered next as they typically depend on repositories
3. **Controllers**: Registered after services as they depend on service layer
4. **Routers**: Registered last as they depend on controllers

### Component Registration Details

#### Repositories
- Created with a DataSource instance
- Registered in TypeDI container
- Used for database operations

#### Services
- Dependencies are resolved using TypeDI
- Registered in container
- Can depend on repositories and other services

#### Controllers
- Dependencies are resolved using TypeDI
- Registered in container
- Handle HTTP requests

#### Routers
- Special handling for router registration
- Registered in both TypeDI container and router registry
- Use a unique Token for identification

## Dependency Injection

The system uses TypeDI's dependency injection system to resolve dependencies. When creating a component:

1. The `getDependencies` method retrieves parameter types using `Reflect.getMetadata`
2. Each dependency is resolved from the TypeDI container
3. If a dependency cannot be resolved, an error is thrown

## Usage Example

```typescript
@Module({
    controllers: [UserController],
    services: [UserService],
    repositories: [UserRepository],
    routers: [UserRouter]
})
export class UserModule {}
```

## Error Handling

The system includes robust error handling:
- Dependencies that cannot be resolved throw descriptive errors
- Invalid module metadata is handled gracefully
- Type mismatches are caught during registration

## Performance Considerations

1. **Lazy Loading**: Components are only created when needed
2. **Caching**: TypeDI container caches instances to avoid recreation
3. **Order of Operations**: Components are registered in dependency order to prevent circular dependencies

## Best Practices

1. Always define clear dependencies in your components
2. Use proper typing for better dependency resolution
3. Follow the registration order (repositories -> services -> controllers -> routers)
4. Keep modules focused and cohesive
5. Use exports properly when sharing components between modules

## Common Issues and Solutions

1. **Circular Dependencies**: Ensure proper component order and avoid circular references
2. **Missing Dependencies**: Make sure all required dependencies are properly registered
3. **Type Resolution**: Use proper TypeScript types for better dependency injection
4. **Router Registration**: Ensure routers are properly registered with their tokens

This module loading system provides a robust foundation for organizing and managing application components while maintaining proper dependency injection and separation of concerns.
