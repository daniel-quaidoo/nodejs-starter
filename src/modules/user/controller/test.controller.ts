import { UUID } from 'crypto';
import { Body, Param, Params, Query } from '../../../core/common/decorators/param.decorator';
import { Controller, Get, Post, Put } from '../../../core/common/decorators/route.decorator';
import {
    IsString,
    IsEmail,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsUUID,
    Min,
    Max,
} from 'class-validator';

// ========== DTO Classes ==========

// Body DTOs
class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsNumber()
    @Min(18)
    @Max(120)
    age: number;
}

class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNumber()
    @Min(18)
    @Max(120)
    @IsOptional()
    age?: number;
}

// Query DTOs
class UserListQuery {
    @IsNumber()
    @IsOptional()
    @Min(1)
    page?: number = 1;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsString()
    @IsOptional()
    search?: string;

    @IsBoolean()
    @IsOptional()
    active?: boolean;
}

class PostFilterQuery {
    @IsString()
    @IsOptional()
    category?: string;

    @IsBoolean()
    @IsOptional()
    published?: boolean;
}

// Params DTOs (for @Params with validation)
class UserParams {
    @IsUUID()
    userId: string;
}

class UserPostParams {
    @IsUUID()
    userId: string;

    @IsUUID()
    postId: string;
}

// ========== TEST ENDPOINTS ==========

@Controller('/test')
export class TestController {
    // ========== 1. Individual @Param Tests ==========

    /**
     * Test individual @Param with auto-type detection
     * GET /api/test/users/550e8400-e29b-41d4-a716-446655440000
     */
    @Get('/users/:userUuid')
    getUserById(
        @Param('userUuid') userUuid: UUID // auto-detects string + UUID validation
    ): any {
        return {
            message: 'Individual @Param test',
            userUuid,
            userUuidType: typeof userUuid,
        };
    }

    /**
     * Test multiple individual @Param with different types
     * GET /api/test/users/550e8400-e29b-41d4-a716-446655440000/posts/123?active=true
     */
    @Get('/users/:userId/posts/:postNumber')
    getUserPost(
        @Param('userId') userId: string, // string + UUID
        @Param('postNumber') postNumber: number, // auto-converts to number
        @Query() query: PostFilterQuery // query validation
    ): any {
        return {
            message: 'Multiple @Param + @Query test',
            userId,
            postNumber,
            userIdType: typeof userId,
            postNumberType: typeof postNumber,
            query,
        };
    }

    // ========== 2. @Params() Without DTO Tests ==========

    /**
     * Test @Params() capturing all route parameters (no DTO validation)
     * GET /api/test/blogs/my-blog/posts/550e8400-e29b-41d4-a716-446655440000/comments/abc123
     */
    @Get('/blogs/:blogId/posts/:postId/comments/:commentId')
    getBlogPostComment(
        @Params() params: Record<string, any> // captures all params with basic validation
    ): any {
        return {
            message: '@Params() without DTO test',
            allParams: params,
            paramKeys: Object.keys(params),
        };
    }

    // ========== 3. @Params() With DTO Tests ==========

    /**
     * Test @Params() with DTO validation
     * GET /api/test/validated-users/550e8400-e29b-41d4-a716-446655440000
     */
    @Get('/validated-users/:userId')
    getValidatedUser(
        @Params() params: UserParams // validates userId as UUID
    ): any {
        return {
            message: '@Params(DTO) test',
            params,
            userId: params.userId,
        };
    }

    /**
     * Test @Params() with complex DTO validation
     * GET /api/test/validated-users/550e8400-e29b-41d4-a716-446655440000/posts/550e8400-e29b-41d4-a716-446655440001
     */
    @Get('/validated-users/:userId/posts/:postId')
    getValidatedUserPost(
        @Params() params: UserPostParams // validates both UUIDs
    ): any {
        return {
            message: '@Params(DTO) with multiple params test',
            params,
            userId: params.userId,
            postId: params.postId,
        };
    }

    // ========== 4. @Body() Tests ==========

    /**
     * Test @Body() validation
     * POST /api/test/users
     * Body: { "name": "John Doe", "email": "john@example.com", "age": 25 }
     */
    @Post('/users')
    createUser(@Body() createUserDto: CreateUserDto): any {
        return {
            message: '@Body() test',
            receivedData: createUserDto,
            dataTypes: {
                name: typeof createUserDto.name,
                email: typeof createUserDto.email,
                age: typeof createUserDto.age,
            },
        };
    }

    /**
     * Test @Body() with optional fields
     * PATCH /api/test/users/550e8400-e29b-41d4-a716-446655440000
     * Body: { "name": "Jane Doe" }
     */
    @Put('/users/:userId')
    updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): any {
        return {
            message: '@Param() + @Body() test',
            userId,
            updateData: updateUserDto,
        };
    }

    // ========== 5. @Query() Tests ==========

    /**
     * Test @Query() validation
     * GET /api/test/users?page=2&limit=20&search=john&active=true
     */
    @Get('/users')
    getUsers(@Query() query: UserListQuery): any {
        return {
            message: '@Query() test',
            queryParams: query,
            queryTypes: {
                page: typeof query.page,
                limit: typeof query.limit,
                search: typeof query.search,
                active: typeof query.active,
            },
        };
    }

    // ========== 6. Mixed Combinations ==========

    /**
     * Test all decorators together
     * PUT /api/test/users/550e8400-e29b-41d4-a716-446655440000/posts/550e8400-e29b-41d4-a716-446655440001?published=true&category=tech
     * Body: { "name": "Updated User", "email": "updated@example.com", "age": 30 }
     */
    @Put('/users/:userId/posts/:postId')
    updateUserPost(
        @Param('userId') userId: string,
        @Param('postId') postId: string,
        @Query() query: PostFilterQuery,
        @Body() body: UpdateUserDto
    ): any {
        return {
            message: 'All decorators test: @Param() + @Query() + @Body()',
            userId,
            postId,
            query,
            body,
            types: {
                userId: typeof userId,
                postId: typeof postId,
                query: typeof query,
                body: typeof body,
            },
        };
    }

    /**
     * Test @Params() + @Query() + @Body()
     * POST /api/test/complex/550e8400-e29b-41d4-a716-446655440000/posts/550e8400-e29b-41d4-a716-446655440001?published=false
     * Body: { "name": "Complex Test", "email": "complex@example.com", "age": 35 }
     */
    @Post('/complex/:userId/posts/:postId')
    complexEndpoint(
        @Params() params: UserPostParams,
        @Query() query: PostFilterQuery,
        @Body() body: CreateUserDto
    ): any {
        return {
            message: 'Complex test: @Params(DTO) + @Query(DTO) + @Body(DTO)',
            params,
            query,
            body,
            allData: {
                ...params,
                ...query,
                ...body,
            },
        };
    }

    /**
     * Test mixed @Param() and @Params()
     * GET /api/test/mixed/550e8400-e29b-41d4-a716-446655440000/posts/550e8400-e29b-41d4-a716-446655440001/comments/abc123?page=1
     */
    @Get('/mixed/:userId/posts/:postId/comments/:commentNumber')
    mixedParamsTest(
        @Param('userId') userId: string, // individual param
        @Params() allParams: Record<string, any>, // all params
        @Query() query: UserListQuery // query validation
    ): any {
        return {
            message: 'Mixed @Param() + @Params() + @Query() test',
            specificUserId: userId,
            allParams,
            query,
            demonstration: {
                userIdFromParam: userId,
                userIdFromParams: allParams.userId,
                areEqual: userId === allParams.userId,
            },
        };
    }

    // ========== 7. Edge Cases ==========

    /**
     * Test with no decorators (should work normally)
     * GET /api/test/no-decorators
     */
    @Get('/no-decorators')
    noDecorators(): any {
        return {
            message: 'No validation decorators test',
            note: 'This endpoint has no @Param, @Query, or @Body decorators',
        };
    }

    /**
     * Test boolean and number conversion
     * GET /api/test/types/true/42?active=false&count=100
     */
    @Get('/types/:isEnabled/:count')
    typeConversionTest(
        @Param('isEnabled') isEnabled: boolean,
        @Param('count') count: number,
        @Query() query: Record<string, any>
    ): any {
        return {
            message: 'Type conversion test',
            params: {
                isEnabled,
                count,
                enabledType: typeof isEnabled,
                countType: typeof count,
            },
            query,
            queryTypes: Object.fromEntries(
                Object.entries(query).map(([key, value]) => [key, typeof value])
            ),
        };
    }
}

// ========== TEST CURL COMMANDS ==========

/*
# 1. Individual @Param test
curl "http://localhost:3000/api/test/users/550e8400-e29b-41d4-a716-446655440000"

# 2. Multiple @Param + @Query test  
curl "http://localhost:3000/api/test/users/550e8400-e29b-41d4-a716-446655440000/posts/123?published=true&category=tech"

# 3. @Params() without DTO test
curl "http://localhost:3000/api/test/blogs/my-blog/posts/550e8400-e29b-41d4-a716-446655440000/comments/abc123"

# 4. @Params(DTO) test
curl "http://localhost:3000/api/test/validated-users/550e8400-e29b-41d4-a716-446655440000"

# 5. @Params(DTO) with multiple params
curl "http://localhost:3000/api/test/validated-users/550e8400-e29b-41d4-a716-446655440000/posts/550e8400-e29b-41d4-a716-446655440001"

# 6. @Body() test
curl -X POST "http://localhost:3000/api/test/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":25}'

# 7. @Param() + @Body() test
curl -X PATCH "http://localhost:3000/api/test/users/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe"}'

# 8. @Query() test
curl "http://localhost:3000/api/test/users?page=2&limit=20&search=john&active=true"

# 9. All decorators test
curl -X PUT "http://localhost:3000/api/test/users/550e8400-e29b-41d4-a716-446655440000/posts/550e8400-e29b-41d4-a716-446655440001?published=true&category=tech" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated User","email":"updated@example.com","age":30}'

# 10. Complex test with all DTO validations
curl -X POST "http://localhost:3000/api/test/complex/550e8400-e29b-41d4-a716-446655440000/posts/550e8400-e29b-41d4-a716-446655440001?published=false" \
  -H "Content-Type: application/json" \
  -d '{"name":"Complex Test","email":"complex@example.com","age":35}'

# 11. Mixed @Param() and @Params() test
curl "http://localhost:3000/api/test/mixed/550e8400-e29b-41d4-a716-446655440000/posts/550e8400-e29b-41d4-a716-446655440001/comments/abc123?page=1"

# 12. Type conversion test
curl "http://localhost:3000/api/test/types/true/42?active=false&count=100"

# Error cases to test validation:

# Invalid UUID
curl "http://localhost:3000/api/test/users/invalid-uuid"

# Invalid email in body
curl -X POST "http://localhost:3000/api/test/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"not-an-email","age":25}'

# Invalid age (too low)
curl -X POST "http://localhost:3000/api/test/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","age":10}'

# Invalid query parameter
curl "http://localhost:3000/api/test/users?page=0&limit=200"
*/
