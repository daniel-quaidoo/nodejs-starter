# Routing System

This document explains the comprehensive routing system that powers the application's API endpoints. The system supports multiple routing strategies including decorator-based routes, base CRUD routes, and custom route definitions.

## Table of Contents
1. [Core Concepts](#core-concepts)
2. [Route Types](#route-types)
   - [Decorator-based Routes](#decorator-based-routes)
   - [Base CRUD Routes](#base-crud-routes)
   - [Custom Routes](#custom-routes)
3. [Route Registration](#route-registration)
4. [Middleware System](#middleware-system)
5. [Request Validation](#request-validation)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Examples](#examples)

## Core Concepts

The routing system is built on top of Express.js and provides:

- **Type-safe route definitions** with TypeScript decorators
- **Automatic route registration** through module system
- **Flexible middleware** support at multiple levels
- **Request validation** using class-validator
- **Standardized response** formatting
- **OpenAPI/Swagger** documentation generation support

## Route Types

### 1. Decorator-based Routes

Define routes using TypeScript decorators directly on controller methods:

```typescript
@Controller('/users')
@ApiTags('Users')
export class UserController {
    @Get('/profile')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'Returns user profile' })
    public async getProfile(
        @Request() req: AuthRequest,
        @Response() res: ExpressResponse
    ): Promise<void> {
        // Implementation
    }
}
```

### 2. Base CRUD Routes

Automatically generated RESTful routes with `BaseRouter`:

```typescript
// Automatically provides:
// GET    /users          - List users
// GET    /users/:id      - Get user by ID
// POST   /users          - Create user
// PUT    /users/:id      - Update user
// DELETE /users/:id      - Delete user

@injectable()
export class UserRouter extends BaseRouter<User> {
    constructor(@inject(Tokens.UserController) controller: UserController) {
        super('/users', controller);
    }
}
```

### 3. Custom Routes

Define custom routes with full control over the handler:

```typescript
@injectable()
export class AuthRouter extends BaseRouter<Auth> {
    protected getCustomRoutes(): RouteDefinition[] {
        return [
            {
                method: 'post',
                path: '/login',
                handler: this.controller.login.bind(this.controller),
                middlewares: [validateRequest(LoginDto)],
                swagger: {
                    summary: 'User login',
                    body: LoginDto,
                    responses: {
                        200: { description: 'Login successful' },
                        401: { description: 'Invalid credentials' }
                    }
                }
            },
            {
                method: 'post',
                path: '/refresh-token',
                handler: this.controller.refreshToken.bind(this.controller),
                middlewares: [validateRequest(RefreshTokenDto)]
            }
        ];
    }
}
```

## Route Registration

1. **Module Initialization**
   - Modules are loaded by the `ModuleLoader`
   - Routers are registered with the `RouterRegistry`

2. **Route Collection**
   - Routes are collected from multiple sources:
     - Decorator-based routes
     - Base CRUD routes
     - Custom route definitions

3. **Express Integration**
   - Routes are registered with Express
   - Global and route-specific middleware is applied
   - Error handling middleware is attached

## Middleware System

### Types of Middleware

1. **Global Middleware**
   - Applied to all routes
   - Example: Logging, request validation

2. **Router-level Middleware**
   - Applied to all routes in a router
   - Example: Authentication, authorization

3. **Route-level Middleware**
   - Applied to specific routes
   - Example: Role-based access control

### Creating Custom Middleware

```typescript
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
};

// Usage in router
@injectable()
export class UserRouter extends BaseRouter<User> {
    constructor(@inject(Tokens.UserController) controller: UserController) {
        super('/users', controller, {
            middlewares: [requestLogger, authMiddleware]
        });
    }
}
```

## Request Validation

### Using class-validator

```typescript
class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}

// In controller
@Post()
public async createUser(
    @Body() createUserDto: CreateUserDto,
    @Response() res: ExpressResponse
) {
    // DTO is already validated
}
```

## Error Handling

### Standard Error Responses

```json
{
    "statusCode": 404,
    "error": "Not Found",
    "message": "User not found",
    "timestamp": "2023-04-01T12:00:00.000Z"
}
```

### Custom Error Classes

```typescript
export class NotFoundException extends HttpException {
    constructor(message: string) {
        super(404, 'Not Found', message);
    }
}

// Usage
throw new NotFoundException('User not found');
```

## Best Practices

### 1. Route Organization
- Group related routes in feature modules
- Use resource-based routing when possible
- Keep controllers thin, delegate to services

### 2. Naming Conventions
- Use plural nouns for resources (`/users`, `/products`)
- Use kebab-case for route paths
- Be consistent with trailing slashes

### 3. Versioning
- Include API version in path (`/api/v1/users`)
- Use headers for content negotiation

### 4. Documentation
- Document all routes with OpenAPI decorators
- Include examples for requests/responses
- Document error responses

## Examples

### Complete Example: User Module

```typescript
// user.controller.ts
@Controller('/users')
@ApiTags('Users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    @ApiOperation({ summary: 'List all users' })
    public async listUsers(
        @Query() query: ListUsersQueryDto,
        @Response() res: ExpressResponse
    ) {
        const users = await this.userService.findAll(query);
        return res.success(users);
    }

    @Post('/')
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new user' })
    public async createUser(
        @Body() createUserDto: CreateUserDto,
        @Response() res: ExpressResponse
    ) {
        const user = await this.userService.create(createUserDto);
        return res.created(user);
    }
}

// user.router.ts
@injectable()
export class UserRouter extends BaseRouter<User> {
    constructor(@inject(Tokens.UserController) controller: UserController) {
        super('/users', controller, {
            middlewares: [authMiddleware],
            exclude: ['delete'] // Don't expose delete endpoint
        });
    }

    protected getCustomRoutes(): RouteDefinition[] {
        return [
            {
                method: 'get',
                path: '/me',
                handler: this.controller.getCurrentUser.bind(this.controller),
                middlewares: [requireAuth],
                swagger: {
                    summary: 'Get current user profile',
                    security: [{ bearerAuth: [] }]
                }
            }
        ];
    }
}
```

### Testing Routes

```typescript
describe('User Routes', () => {
    let app: Express;
    let request: supertest.SuperTest<supertest.Test>;

    beforeAll(() => {
        const module = new UserModule();
        app = express();
        // Setup app with test configuration
        request = supertest(app);
    });

    it('GET /users should return 200', async () => {
        const response = await request.get('/api/v1/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});
```

## Advanced Topics

### 1. Rate Limiting

```typescript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply to specific routes
router.get('/sensitive-data', limiter, (req, res) => {
    // Handle request
});
```

### 2. Request Validation with Zod

```typescript
import { z } from 'zod';

const userSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    age: z.number().int().positive().optional()
});

// In route handler
const result = userSchema.safeParse(req.body);
if (!result.success) {
    throw new BadRequestException('Validation failed', result.error);
}
```

### 3. OpenAPI Documentation

```typescript
@ApiOperation({ 
    summary: 'Create user',
    description: 'Creates a new user account'
})
@ApiBody({ type: CreateUserDto })
@ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: UserResponseDto
})
@ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
})
@Post()
async createUser(@Body() createUserDto: CreateUserDto) {
    // Implementation
}
```

## Performance Considerations

1. **Route Caching**
   - Enable route caching in production
   - Use ETags for caching responses

2. **Middleware Optimization**
   - Only apply middleware where needed
   - Consider performance impact of each middleware

3. **Response Compression**
   - Enable compression for large responses
   - Use appropriate content types

## Security Best Practices

1. **Input Validation**
   - Validate all user input
   - Sanitize data before processing

2. **Authentication/Authorization**
   - Use JWT with secure settings
   - Implement proper role-based access control

3. **CORS**
   - Configure CORS properly
   - Restrict origins in production

4. **Helmet**
   - Use Helmet middleware for security headers
   - Configure Content Security Policy

## Troubleshooting

### Common Issues

1. **Routes Not Found**
   - Check route registration order
   - Verify base paths and prefixes

2. **Middleware Not Firing**
   - Check middleware order
   - Ensure next() is called

3. **Validation Errors**
   - Verify DTO classes
   - Check validation decorators

### Debugging

```typescript
// Enable debug logging
process.env.DEBUG = 'router:*';

// Or for specific components
process.env.DEBUG = 'router:registration,router:middleware';
```
