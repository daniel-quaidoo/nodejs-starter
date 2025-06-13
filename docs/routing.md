# Routing System

This document explains the routing system used in the application, which supports multiple ways to define routes: decorator-based, base CRUD routes, and custom routes.

## Table of Contents
1. [Routing Overview](#routing-overview)
2. [Route Types](#route-types)
   - [Decorator-based Routes](#decorator-based-routes)
   - [Base CRUD Routes](#base-crud-routes)
   - [Custom Routes](#custom-routes)
3. [Route Registration Flow](#route-registration-flow)
4. [Examples](#examples)

## Routing Overview

The routing system is built on top of Express.js and provides a flexible way to define and manage routes. Routes can be defined using decorators, base CRUD operations, or custom route definitions.

## Route Types

### Decorator-based Routes

Decorator-based routes use TypeScript decorators to define routes directly on controller methods.

**Example:**
```typescript
@Controller('/users')
export class UserController {
    @Get('/profile')
    public async getUserProfile(req: Request, res: Response) {
        // Implementation
    }
}
```

### Base CRUD Routes

Base routes provide standard CRUD operations automatically. These are defined in the `BaseRouter` class.

**Automatically provides:**
- `GET /{resource}` - List all resources
- `GET /{resource}/:id` - Get a single resource
- `POST /{resource}` - Create a new resource
- `PUT /{resource}/:id` - Update a resource
- `DELETE /{resource}/:id` - Delete a resource

### Custom Routes

Custom routes allow you to define specific routes with custom handlers in your router class.

**Example:**
```typescript
protected getCustomRoutes(): RouteDefinition[] {
    return [
        {
            method: 'GET',
            path: '/users/search',
            handler: (req, res, next) => this.controller.searchUsers(req, res, next),
            absolutePath: true
        }
    ];
}
```

## Route Registration Flow

1. **Module Initialization**: When the application starts, `ModuleLoader` loads all modules and their components.
2. **Router Registration**: Each router is registered in the `RouterRegistry`.
3. **Route Collection**: The `getRoutes()` method collects routes from three sources:
   - Decorator-based routes (via `getDecoratorRoutes()`)
   - Base CRUD routes (via `getBaseRoutes()`)
   - Custom routes (via `getCustomRoutes()`)
4. **Express Integration**: Routes are registered with Express in the `initializeRoutes()` method.
5. **Lambda Integration**: The `routes.ts` file collects all routes and configures them for AWS Lambda.

## Examples

### Decorator-based Route Example

```typescript
@Controller('/products')
export class ProductController {
    @Get('/featured')
    public async getFeaturedProducts(req: Request, res: Response) {
        // Return featured products
    }

    @Post('/:id/reviews')
    public async addProductReview(req: Request, res: Response) {
        // Add review for a product
    }
}
```

### Custom Route Example

```typescript
export class OrderRouter extends BaseRouter<Order> {
    protected getCustomRoutes(): RouteDefinition[] {
        return [
            {
                method: 'POST',
                path: '/orders/:id/cancel',
                handler: (req, res, next) => this.controller.cancelOrder(req, res, next),
                absolutePath: true
            },
            {
                method: 'GET',
                path: '/orders/user/:userId',
                handler: (req, res, next) => this.controller.getUserOrders(req, res, next),
                absolutePath: true
            }
        ];
    }
}
```

### Combining Route Types

You can combine all three route types in a single module:

1. Use decorators for simple CRUD-like endpoints
2. Use base routes for standard REST operations
3. Use custom routes for complex or non-standard endpoints

This combination provides flexibility while maintaining consistency across your API.

## Best Practices

1. **Consistency**: Stick to one style (decorator or custom) for similar endpoints
2. **Organization**: Group related routes together in the same controller/router
3. **Documentation**: Document complex routes with JSDoc comments
4. **Middleware**: Apply middleware consistently using the appropriate method for your route type
5. **Testing**: Test all route types to ensure consistent behavior
