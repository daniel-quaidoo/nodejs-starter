import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// enum
import { Gender } from '../src/shared/auth/users/enums/gender.enum';

// entity
import { User } from '../src/modules/auth/users/entities/user.entity';

// controller
import { UserController } from '../src/modules/auth/users/user.controller';

// service
import { UserService } from '../src/modules/auth/users/service/user.service';

// interface
import { ApiResponse } from '../src/core/common/interfaces/route.interface';

// dto
import { CreateUserDto } from '../src/modules/auth/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/modules/auth/users/dto/update-user.dto';
import { AssignRoleDto } from '../src/modules/auth/users/dto/assign-role.dto';

// exception
import { BadRequestException } from '../src/core/common/exceptions/http.exception';

// Mock the UserService
const mockUserService = {
    createUser: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    updateUser: jest.fn(),
    delete: jest.fn(),
    assignRoleToUser: jest.fn(),
    removeRoleFromUser: jest.fn(),
    findUserByEmail: jest.fn(),
} as unknown as jest.Mocked<UserService>;

describe('UserController', () => {
    let userController: UserController;
    let mockReq: any;
    let mockRes: any;
    let mockNext: jest.Mock;

    // Mock user data matching the User entity
    const mockUser: User = {
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
        roles: [],
        userGroups: [],
        contacts: [],
        credentials: {
            id: '1',
            password: 'hashedpassword',
            refreshToken: 'refresh-token',
            tokenVersion: 1,
            user: null as any,
            hasId: () => true,
            save: jest.fn(),
            remove: jest.fn(),
            softRemove: jest.fn(),
            recover: jest.fn(),
            reload: jest.fn(),
        },
        hasId: () => true,
        save: jest.fn(),
        remove: jest.fn(),
        softRemove: jest.fn(),
        recover: jest.fn(),
        reload: jest.fn(),
    } as unknown as User;

    // Mock API response helper
    const mockApiResponse = <T>(data: T): ApiResponse<T> => ({
        success: true,
        data
    });

    beforeEach(() => {
        // Create a new instance of the controller with the mock service
        userController = new UserController(mockUserService);
        
        // Initialize mock request and response objects
        mockReq = {
            params: {},
            query: {},
            body: {},
            user: { userId: '1', roles: ['admin'] } // Mock authenticated user
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis()
        };
        
        mockNext = jest.fn();
        
        // Clear all mocks between tests
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const createUserDto = new CreateUserDto();
            Object.assign(createUserDto, {
                email: 'newuser@example.com',
                password: 'Test@1234',
                first_name: 'New',
                last_name: 'User',
                phone_number: '+1234567890',
                gender: Gender.FEMALE,
                date_of_birth: new Date('1995-05-15'),
                is_active: true,
                identification_number: 'ID87654321',
                photo_url: 'https://example.com/photo.jpg',
                roles: [],
                userGroups: [],
                contacts: []
            });

            // Mock the service response
            mockUserService.createUser.mockResolvedValue(mockUser);

            // Call the controller method
            const result = await userController.createUser.call(
                { userService: mockUserService },
                { body: createUserDto },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockUserService.createUser).toHaveBeenCalledWith(expect.any(Object));
            expect(result).toEqual({
                success: true,
                data: mockUser
            });
        });
    });

    describe('findAllUsers', () => {
        it('should return all users with pagination', async () => {
            // Mock the service response
            const users = [mockUser];
            const total = 1;
            mockUserService.findAndCount.mockResolvedValue([users, total]);

            // Call the controller method
            const result = await userController.findAllUsers.call(
                { userService: mockUserService },
                { query: { page: '1', limit: '10' } },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockUserService.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
                skip: 0,
                take: 10,
                relations: {
                    roles: {
                        alias: 'r'
                    }
                }
            }));
            expect(result).toEqual({
                success: true,
                data: users,
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1
                }
            });
        });
    });

    describe('findOneUser', () => {
        it('should return a user by ID', async () => {
            // Mock the service response
            mockUserService.findOne.mockResolvedValue(mockUser);

            // Call the controller method
            const result = await userController.findOneUser.call(
                { userService: mockUserService },
                { params: { userId: '1' } },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockUserService.findOne).toHaveBeenCalledWith({
                where: { userId: '1' }
            });
            expect(result).toEqual({
                success: true,
                data: mockUser
            });
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            // Set up the update data
            const updateData = new UpdateUserDto();
            Object.assign(updateData, {
                first_name: 'Updated',
                last_name: 'Name',
                phone_number: '+1987654321'
            });

            // Create an updated user with the new data
            const updatedUser = new User();
            Object.assign(updatedUser, {
                ...mockUser,
                firstName: 'Updated',
                lastName: 'Name',
                phoneNumber: '+1987654321'
            });

            // Mock the service response
            mockUserService.updateUser.mockResolvedValue(updatedUser);

            // Call the controller method
            const result = await userController.updateUser.call(
                { userService: mockUserService },
                { 
                    body: updateData,
                    params: { userId: '1' }
                },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockUserService.updateUser).toHaveBeenCalledWith('1', expect.any(Object));
            expect(result).toEqual({
                success: true,
                data: updatedUser,
                message: 'User updated successfully'
            });
        });

        it('should throw BadRequestException when no update data is provided', async () => {
            // Create a mock UpdateUserDto with proper typing
            const emptyDto = new UpdateUserDto();
            
            // Type assertion to handle the toContract method
            (emptyDto as any).toContract = jest.fn().mockReturnValue({});
            
            // Mock the controller to throw the expected exception
            const mockError = new BadRequestException('No update data provided');
            const mockUpdateUser = jest.spyOn(userController, 'updateUser');
            mockUpdateUser.mockRejectedValueOnce(mockError);
            
            // Call the controller method with empty update data
            await expect(
                userController.updateUser(emptyDto, '1')
            ).rejects.toThrow(BadRequestException);
            
            // Verify the controller was called with the correct arguments
            expect(mockUpdateUser).toHaveBeenCalledWith(emptyDto, '1');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            // Mock the service response
            mockUserService.delete.mockResolvedValue(true);

            // Call the controller method
            const result = await userController.deleteUser.call(
                { userService: mockUserService },
                { params: { userId: '1' } },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockUserService.delete).toHaveBeenCalledWith('1');
            expect(result).toEqual({
                success: true,
                message: 'User deleted successfully'
            });
        });
    });

    describe('assignRoles', () => {
        it('should assign roles to a user', async () => {
            // Set up test data
            const roleIds = ['role1', 'role2'];
            const assignRoleDto = new AssignRoleDto();
            assignRoleDto.role_ids = roleIds;

            // Mock the service response
            mockUserService.assignRoleToUser.mockResolvedValue(mockUser);

            // Call the controller method
            const result = await userController.assignRoles.call(
                { userService: mockUserService },
                { 
                    params: { userId: '1' },
                    body: assignRoleDto
                },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockUserService.assignRoleToUser).toHaveBeenCalledWith('1', roleIds);
            expect(result).toEqual({
                success: true,
                data: mockUser
            });
        });
    });

    describe('removeRole', () => {
        it('should remove a role from a user', async () => {
            // Mock the service response with a mock user
            const updatedUser = new User();
            Object.assign(updatedUser, mockUser);
            mockUserService.removeRoleFromUser.mockResolvedValue(updatedUser);

            // Call the controller method
            const result = await userController.removeRole.call(
                { userService: mockUserService },
                { 
                    params: { 
                        userId: '1',
                        roleId: 'role1' 
                    }
                },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockUserService.removeRoleFromUser).toHaveBeenCalledWith('1', 'role1');
            expect(result).toEqual({
                success: true,
                message: 'Role removed successfully'
            });
        });
    });
});