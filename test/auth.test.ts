import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// local imports
import { LoginDto } from '../src/modules/auth/core/auth.dto';
import { AuthService } from '../src/modules/auth/auth.service';
import { Gender } from '../src/shared/auth/users/enums/gender.enum';
import { AuthController } from '../src/modules/auth/auth.controller';
import { User } from '../src/modules/auth/users/entities/user.entity';
import { LoginResponseContractDto } from '../src/shared/auth/auth.dto';
import { CreateUserDto } from '../src/modules/auth/users/dto/create-user.dto';

// Mock the AuthService
const mockAuthService = {
    register: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
} as unknown as jest.Mocked<AuthService>;

describe('AuthController', () => {
    let authController: AuthController;
    let mockReq: any;

    // Mock user data matching the User entity
    const mockUser = {
        userId: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '+1234567890',
        identificationNumber: 'ID12345678',
        gender: Gender.MALE,
        isActive: true,
        dateOfBirth: new Date('1990-01-01'),
        photoUrl: 'https://example.com/photo.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        password: 'hashedpassword',
        roles: [],
        userGroups: [],
        contacts: []
    } as unknown as User;

    const mockLoginResponse: LoginResponseContractDto = {
        access_token: 'mock-access-token',
        user_id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        token_version: 1
    };

    const mockLogoutResponse = {
        success: true,
        message: 'Successfully logged out',
    };

    beforeEach(() => {
        // Create a new instance of the controller with the mock service
        authController = new AuthController(mockAuthService);
        
        // Initialize mock request object
        mockReq = {
            headers: {},
            rawHeaders: []
        };
        
        // Clear all mocks between tests
        jest.clearAllMocks();
    });


    describe('register', () => {
        it('should register a new user', async () => {
            // Create test data matching CreateUserDto
            const testUserData = new CreateUserDto();
            testUserData.email = 'test@example.com';
            testUserData.password = 'Test@1234';
            testUserData.first_name = 'Test';
            testUserData.last_name = 'User';
            testUserData.phone_number = '+1234567890';
            testUserData.identification_number = 'ID12345678';
            testUserData.gender = Gender.MALE;
            testUserData.is_active = true;
            testUserData.date_of_birth = new Date('1990-01-01');
            testUserData.photo_url = 'https://example.com/photo.jpg';
            testUserData.roles = [];
            testUserData.userGroups = [];
            testUserData.contacts = [];

            // Mock the toContract method
            jest.spyOn(testUserData, 'toContract').mockReturnValue({
                email: testUserData.email,
                password: testUserData.password,
                firstName: testUserData.first_name,
                lastName: testUserData.last_name,
                phoneNumber: testUserData.phone_number,
                identificationNumber: testUserData.identification_number,
                gender: testUserData.gender,
                isActive: testUserData.is_active,
                dateOfBirth: testUserData.date_of_birth,
                photoUrl: testUserData.photo_url,
                roles: [],
                userGroups: [],
                contacts: []
            });

            // Mock the service response
            mockAuthService.register.mockResolvedValue(mockUser);

            // Mock Express response object
            const mockRes = {
                json: jest.fn()
            };

            // Call the controller method with mocked req, res, next
            await (authController as any).register(
                { body: testUserData },
                mockRes,
                jest.fn()
            );

            // Verify the response was sent with the expected data
            expect(mockRes.json).toHaveBeenCalledWith(mockUser);

            // Verify the service was called with the contract
            expect(mockAuthService.register).toHaveBeenCalledWith({
                email: testUserData.email,
                password: testUserData.password,
                firstName: testUserData.first_name,
                lastName: testUserData.last_name,
                phoneNumber: testUserData.phone_number,
                identificationNumber: testUserData.identification_number,
                gender: testUserData.gender,
                isActive: testUserData.is_active,
                dateOfBirth: testUserData.date_of_birth,
                photoUrl: testUserData.photo_url,
                roles: [],
                userGroups: [],
                contacts: []
            });

            // Verify toContract was called
            expect(testUserData.toContract).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should login a user with valid credentials', async () => {
            const loginDto: LoginDto = {
                email: 'test@example.com',
                password: 'Test@1234',
            };

            // Mock the service response
            mockAuthService.signIn.mockResolvedValue(mockLoginResponse);

            // Mock Express response and next function
            const mockRes = {
                json: jest.fn()
            };
            const mockNext = jest.fn();

            // Call the controller method with the correct context and parameters
            await authController.login.call(
                { authService: mockAuthService },
                { body: loginDto },
                mockRes,
                mockNext
            );

            // Verify the service was called with the correct arguments
            expect(mockAuthService.signIn).toHaveBeenCalledWith(loginDto);

            // Verify the response was sent with the expected data
            expect(mockRes.json).toHaveBeenCalledWith(mockLoginResponse);
        });
    });

    describe('logout', () => {
        it('should logout a user with a valid token from headers', async () => {
            const token = 'test-token';
            
            // Mock the service response
            mockAuthService.signOut.mockResolvedValue(mockLogoutResponse);

            // Create a mock request object
            const req = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                rawHeaders: []
            };

            // Create a mock controller instance with the request attached
            const controllerInstance = new AuthController(mockAuthService);
            (controllerInstance as any).req = req;

            const mockRes = {
                json: jest.fn()
            };


            // Call the controller method
            await (controllerInstance as any).logout(
                req,
                mockRes,
                jest.fn()
            );
            
            // Verify the service was called with the correct token
            expect(mockAuthService.signOut).toHaveBeenCalledWith(token);

            // Verify the result is as expected
            expect(mockRes.json).toHaveBeenCalledWith(mockLogoutResponse);
        });

        it('should handle logout with token from rawHeaders', async () => {
            const token = 'test-token';
            
            // Mock the service response
            mockAuthService.signOut.mockResolvedValue(mockLogoutResponse);

            // Create a mock request object with token in rawHeaders
            const req = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                rawHeaders: ['Authorization', `Bearer ${token}`]
            };

            // Create a mock controller instance with the request attached
            const controllerInstance = new AuthController(mockAuthService);
            (controllerInstance as any).req = req;

             // Mock Express response object
             const mockRes = {
                json: jest.fn()
            };

            // Call the controller method
            await (controllerInstance as any).logout(
                req,
                mockRes,
                jest.fn()
            );
            
            // Verify the service was called with the correct token
            expect(mockAuthService.signOut).toHaveBeenCalledWith(token);
            
            // Verify the result is as expected
            expect(mockRes.json).toHaveBeenCalledWith(mockLogoutResponse);
        });
    });
});
