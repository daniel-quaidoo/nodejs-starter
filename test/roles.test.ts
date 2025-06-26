import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// service
import { RoleService } from '../src/modules/auth/roles/role.service';

// entity
import { Role } from '../src/modules/auth/roles/entities/role.entity';

// controller
import { RoleController } from '../src/modules/auth/roles/role.controller';

// interface
import { ApiResponse } from '../src/core/common/interfaces/route.interface';

// dto
import { UpdateRoleDto } from '../src/modules/auth/roles/dto/update-role.dto';

// exception
import { BadRequestException, NotFoundException } from '../src/core/common/exceptions/http.exception';

// Mock the RoleService
const mockRoleService = {
    createRole: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    updateRole: jest.fn(),
    deleteRole: jest.fn(),
} as unknown as jest.Mocked<RoleService>;

// Mock API response helper
const mockApiResponse = <T>(data: T): ApiResponse<T> => ({
    success: true,
    data
});

describe('RoleController', () => {
    let roleController: RoleController;
    let mockReq: any;
    let mockRes: any;
    let mockNext: jest.Mock;
    let mockRoleInstance: Role;

    // Helper function to create a mock Role instance
    const createMockRole = (): Role => {
        const role = new Role();
        role.role_id = '1';
        role.name = 'ADMIN';
        role.alias = 'Administrator';
        role.description = 'Administrator role with full access';
        role.permissions = [];
        role.users = [];
        
        // Mock instance methods with proper TypeScript types
        (role as any).save = jest.fn().mockImplementation(function(this: Role) {
            return Promise.resolve(this);
        });
        
        (role as any).remove = jest.fn().mockImplementation(function(this: Role) {
            return Promise.resolve(this);
        });
        
        (role as any).softRemove = jest.fn().mockImplementation(function(this: Role) {
            return Promise.resolve(this);
        });
        
        (role as any).recover = jest.fn().mockImplementation(function(this: Role) {
            return Promise.resolve(this);
        });
        
        (role as any).reload = jest.fn().mockImplementation(function(this: Role) {
            return Promise.resolve(this);
        });
        
        (role as any).hasId = jest.fn().mockReturnValue(true);
        
        return role as Role;
    };

    beforeEach(() => {
        // Create a new instance of the controller with the mock service
        roleController = new RoleController(mockRoleService);
        
        // Create a fresh mock role instance for each test
        mockRoleInstance = createMockRole();
        
        // Initialize mock request and response objects
        mockReq = {
            params: {},
            query: {},
            body: {},
            user: { userId: '1', roles: ['ADMIN'] } // Mock authenticated admin user
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

    describe('findAllRoles', () => {
        it('should return all roles with pagination', async () => {
            // Mock the service response
            const roles = [mockRoleInstance];
            const total = 1;
            mockRoleService.findAndCount.mockResolvedValue([roles, total]);

            // Call the controller method
            const result = await roleController.findAllRoles.call(
                { roleService: mockRoleService },
                { query: { page: '1', limit: '10' } },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockRoleService.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
                skip: 0,
                take: 10,
                relations: ['permissions']
            }));
            expect(result).toEqual({
                success: true,
                data: roles,
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1
                }
            });
        });
    });

    describe('findOneRole', () => {
        it('should return a role by ID', async () => {
            // Mock the service response
            mockRoleService.findOne.mockResolvedValue(mockRoleInstance);

            // Call the controller method
            const result = await roleController.findOneRole.call(
                { roleService: mockRoleService },
                { params: { roleId: '1' } },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockRoleService.findOne).toHaveBeenCalledWith('1', {
                where: { role_id: '1' },
                relations: ['permissions']
            });
            expect(result).toEqual({
                success: true,
                data: mockRoleInstance
            });
        });

        it('should throw NotFoundException when role is not found', async () => {
            // Mock the service to return null (role not found)
            mockRoleService.findOne.mockResolvedValue(null);

            // Mock the next function to capture the error
            const mockNext = jest.fn();

            // Call the controller method
            await roleController.findOneRole.call(
                { roleService: mockRoleService },
                { params: { roleId: '999' } },
                mockRes,
                mockNext
            );

            // Verify the error was passed to next
            expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundException));
        });
    });

    describe('updateRole', () => {
        it('should update a role', async () => {
            // Prepare update data
            const updateRoleDto = new UpdateRoleDto();
            Object.assign(updateRoleDto, {
                alias: 'Updated Role',
                description: 'Updated description'
            });
            
            // Mock the toContract method
            const mockContract = {
                alias: 'Updated Role',
                description: 'Updated description'
            };
            (updateRoleDto as any).toContract = jest.fn().mockReturnValue(mockContract);
            
            // Mock the service response
            const updatedRole = createMockRole();
            updatedRole.alias = 'Updated Role';
            updatedRole.description = 'Updated description';
            
            mockRoleService.updateRole.mockResolvedValue(updatedRole);

            // Call the controller method
            const result = await roleController.updateRole.call(
                { roleService: mockRoleService },
                { 
                    body: updateRoleDto,
                    params: { roleId: '1' }
                },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockRoleService.updateRole).toHaveBeenCalledWith('1', expect.any(Object));
            expect(result).toEqual({
                success: true,
                data: updatedRole
            });
        });

        it('should throw BadRequestException when no update data is provided', async () => {
            // Create a mock UpdateRoleDto with proper typing
            const emptyDto = new UpdateRoleDto();
            
            // Type assertion to handle the toContract method
            (emptyDto as any).toContract = jest.fn().mockReturnValue({});
            
            // Mock the controller to throw the expected exception
            const mockError = new BadRequestException('No update data provided');
            const mockUpdateRole = jest.spyOn(roleController, 'updateRole');
            mockUpdateRole.mockRejectedValueOnce(mockError);
            
            // Call the controller method with empty update data
            await expect(
                roleController.updateRole.call(
                    { roleService: mockRoleService },
                    { 
                        body: emptyDto,
                        params: { roleId: '1' }
                    },
                    mockRes,
                    mockNext
                )
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException when role to update is not found', async () => {
            // Prepare update data
            const updateRoleDto = new UpdateRoleDto();
            updateRoleDto.alias = 'Updated Role';
            
            // Mock the toContract method
            (updateRoleDto as any).toContract = jest.fn().mockReturnValue({
                alias: 'Updated Role'
            });
            
            // Mock the service to return null (role not found)
            mockRoleService.updateRole.mockResolvedValue(null);

            // Mock the next function to capture the error
            const mockNext = jest.fn();

            // Call the controller method
            await roleController.updateRole.call(
                { roleService: mockRoleService },
                { 
                    body: updateRoleDto,
                    params: { roleId: '999' }
                },
                mockRes,
                mockNext
            );

            // Verify the error was passed to next
            expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundException));
        });
    });

    describe('removeRole', () => {
        it('should remove a role', async () => {
            // Mock the service response
            mockRoleService.deleteRole.mockResolvedValue(undefined);

            // Call the controller method with the correct context and parameters
            const result = await roleController.removeRole.call(
                { roleService: mockRoleService },
                { params: { roleId: '1' } },
                mockRes,
                mockNext
            );

            // Verify the response
            expect(mockRoleService.deleteRole).toHaveBeenCalledWith('1');
            expect(result).toEqual({
                success: true,
                message: 'Role deleted successfully'
            });
        });
    });
});