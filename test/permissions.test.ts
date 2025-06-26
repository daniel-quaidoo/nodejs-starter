import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// exception
import { NotFoundException } from '../src/core/common/exceptions/http.exception';

// service
import { PermissionService } from '../src/modules/auth/permissions/permission.service';

// entity
import { Permission } from '../src/modules/auth/permissions/entities/permission.entity';

// controller
import { PermissionController } from '../src/modules/auth/permissions/permission.controller';

// dto
import { CreatePermissionDto } from '../src/modules/auth/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '../src/modules/auth/permissions/dto/update-permission.dto';

describe('PermissionController', () => {
    let permissionController: PermissionController;
    let mockPermissionService: jest.Mocked<PermissionService>;
    
    let mockResponse: { json: jest.Mock };
    const mockReq = {};
    let mockNext: jest.Mock;

    // Helper function to create a mock Permission instance
    const createMockPermission = (): Permission => {
        const permission = new Permission();
        permission.permissionId = '1';
        permission.name = 'USER_CREATE';
        permission.alias = 'Create User';
        permission.description = 'Allows creating new users';
        permission.roles = [];
        permission.groups = [];
        
        // Mock instance methods
        (permission as any).save = jest.fn().mockImplementation(function(this: Permission) {
            return Promise.resolve(this);
        });
        
        return permission;
    };

    beforeEach(() => {
        // Create a mock response with json method
        mockResponse = {
            json: jest.fn().mockReturnThis()
        };
        
        // Create a fresh mock next function for each test
        mockNext = jest.fn();

        // Create a mock PermissionService
        mockPermissionService = {
            create: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<PermissionService>;

        // Create the controller with the mocked service
        permissionController = new PermissionController(mockPermissionService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPermission', () => {
        it('should create a new permission', async () => {
            // Mock data
            const createDto = new CreatePermissionDto();
            createDto.name = 'USER_CREATE';
            createDto.alias = 'Create User';
            createDto.description = 'Allows creating new users';
            
            // Mock the toContract method
            (createDto as any).toContract = jest.fn().mockReturnValue({
                name: 'USER_CREATE',
                alias: 'Create User',
                description: 'Allows creating new users'
            });
            
            // Mock the service response
            const mockPermission = createMockPermission();
            mockPermissionService.create.mockResolvedValue(mockPermission);

            // Call the controller method
            await permissionController.createPermission.call(
                permissionController,
                { body: createDto },
                mockResponse,
                mockNext
            );

            // Verify the response
            expect(mockPermissionService.create).toHaveBeenCalledWith(expect.any(Object));
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockPermission
            });
        });
    });

    describe('findAllPermissions', () => {
        it('should return all permissions with pagination', async () => {
            // Mock data
            const mockPermissions = [createMockPermission()];
            const totalCount = 1;
            
            // Mock the service response
            mockPermissionService.findAndCount.mockResolvedValue([mockPermissions, totalCount]);

            // Call the controller method
            await permissionController.findAllPermissions.call(
                permissionController,
                mockReq,
                mockResponse,
                mockNext
            );

            // Verify the response
            expect(mockPermissionService.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
                skip: 0,
                take: 10,
                relations: ['roles', 'groups']
            }));
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockPermissions,
                meta: {
                    page: 1,
                    limit: 10,
                    total: totalCount,
                    totalPages: 1
                }
            });
        });
    });

    describe('findOnePermission', () => {
        it('should return a permission by ID', async () => {
            // Mock data
            const mockPermission = createMockPermission();
            
            // Mock the service response
            mockPermissionService.findOne.mockResolvedValue(mockPermission);

            // Call the controller method
            await permissionController.findOnePermission.call(
                permissionController,
                { params: { permissionId: '1' } },
                mockResponse,
                mockNext
            );

            // Verify the response
            expect(mockPermissionService.findOne).toHaveBeenCalledWith('1', {
                where: { permissionId: '1' },
                relations: ['roles', 'groups']
            });
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockPermission
            });
        });

        it('should throw NotFoundException when permission is not found', async () => {
            // Mock the service to return null (permission not found)
            mockPermissionService.findOne.mockResolvedValue(null);

            // Mock the next function to capture the error
            const mockNext = jest.fn();

            // Call the controller method
            await permissionController.findOnePermission.call(
                permissionController,
                { params: { permissionId: '999' } },
                mockResponse,
                mockNext
            );

            // Verify the error was passed to next
            expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundException));
        });
    });

    describe('updatePermission', () => {
        it('should update a permission', async () => {
            // Prepare update data
            const updateDto = new UpdatePermissionDto();
            updateDto.alias = 'Updated Alias';
            updateDto.description = 'Updated description';
            
            // Mock the toContract method
            (updateDto as any).toContract = jest.fn().mockReturnValue({
                alias: 'Updated Alias',
                description: 'Updated description'
            });
            
            // Mock the service response
            const updatedPermission = createMockPermission();
            updatedPermission.alias = 'Updated Alias';
            updatedPermission.description = 'Updated description';
            
            mockPermissionService.update.mockResolvedValue(updatedPermission);

            // Call the controller method
            await permissionController.updatePermission.call(
                permissionController,
                { 
                    body: updateDto,
                    params: { permissionId: '1' }
                },
                mockResponse,
                mockNext
            );

            // Verify the response
            expect(mockPermissionService.update).toHaveBeenCalledWith('1', expect.any(Object));
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: updatedPermission
            });
        });

        it('should throw NotFoundException when permission to update is not found', async () => {
            // Prepare update data
            const updateDto = new UpdatePermissionDto();
            updateDto.alias = 'Updated Alias';
            
            // Mock the toContract method
            (updateDto as any).toContract = jest.fn().mockReturnValue({
                alias: 'Updated Alias'
            });
            
            // Mock the service to return null (permission not found)
            mockPermissionService.update.mockResolvedValue(null);

            // Mock the next function to capture the error
            const mockNext = jest.fn();

            // Call the controller method
            await permissionController.updatePermission.call(
                permissionController,
                { 
                    body: updateDto,
                    params: { permissionId: '999' }
                },
                mockResponse,
                mockNext
            );

            // Verify the error was passed to next
            expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundException));
        });
    });

    describe('removePermission', () => {
        it('should remove a permission', async () => {
            // Mock the service response
            mockPermissionService.delete.mockResolvedValue(true);

            // Call the controller method
            await permissionController.removePermission.call(
                permissionController,
                { params: { permissionId: '1' } },
                mockResponse,
                mockNext
            );

            // Verify the response
            expect(mockPermissionService.delete).toHaveBeenCalledWith('1');
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Permission deleted successfully'
            });
        });

        it('should throw NotFoundException when permission to delete is not found', async () => {
            // Mock the service to return false (permission not found)
            mockPermissionService.delete.mockResolvedValue(false);

            // Mock the next function to capture the error
            const mockNext = jest.fn();

            // Call the controller method
            await permissionController.removePermission.call(
                permissionController,
                { params: { permissionId: '999' } },
                mockResponse,
                mockNext
            );

            // Verify the error was passed to next
            expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundException));
        });
    });
});
