import bcrypt from 'bcrypt';
import { Inject } from "typedi";
import { FindOneOptions, FindOptionsWhere, DeepPartial, IsNull } from "typeorm";

// model
import { User } from "../entities/user.entity";
import { BaseService } from "../../../../core/common";
import { Role } from "../../roles/entities/role.entity";

// service
import { RoleService } from "../../roles/role.service";

// repository
import { UserRepository } from "../repository/user.repository";

// entity
import { UserCredentials } from "../entities/user-credentials.entity";

// decorator
import { Service } from "../../../../core/common/di/component.decorator";

// dto
import { CreateUserContractDto } from "../../../../shared/auth/users/create-user.dto";
import { UpdateUserContractDto } from "../../../../shared/auth/users/update-user.dto";
import { CreateRoleContractDto } from "../../../../shared/auth/roles/create-role.dto";

// exception
import { ConflictException, NotFoundException } from "../../../../core/common/exceptions/http.exception";

@Service()
export class UserService extends BaseService<User> {

    constructor(
        @Inject() private roleService: RoleService,
        @Inject() private userRepository: UserRepository,
    ) {
        super(userRepository);
    }

    async createUser(dto: CreateUserContractDto): Promise<User> {

        try {


            let roles: Role[] = [];

            // if roles are objects, create them
            if (dto.roles && dto.roles.length) {
                if (typeof dto.roles[0] === 'object') {
                    roles = await Promise.all(
                        dto.roles.map(roleData =>
                            this.roleService.createRole(roleData as CreateRoleContractDto)
                        )
                    );
                }
                else if (typeof dto.roles[0] === 'string') {
                    roles = await this.roleService.findRolesByIds(dto.roles as string[]);
                }
            }

            // create user without saving first
            const user = await this.userRepository.create({
                ...dto,
                roles,
            } as DeepPartial<User>);

            // save the user first to get an ID
            const savedUser = await this.userRepository.save(user);

            // if password field exists, create user credentials
            if (dto.password) {
                const userCreds = this.userRepository.manager.create(UserCredentials, {
                    user: savedUser,
                    password: bcrypt.hashSync(dto.password, 10),
                    isVerified: false,
                    isDisabled: false
                });
                await this.userRepository.manager.save(userCreds);
            }

            const userWithRelations = await this.userRepository.findOne({
                where: { userId: savedUser.userId },
                relations: ['roles']
            });

            if (!userWithRelations) {
                throw new Error('Failed to create user');
            }

            return userWithRelations;
        } catch (error: any) {
            if (error.message.startsWith('A record with this')) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({ relations: ['roles', 'roles.permissions'] });
    }

    async findOne(idOrOptions: string | number | FindOneOptions<User> | FindOptionsWhere<User>): Promise<User> {
        const user = await this.userRepository.findOne(idOrOptions);

        if (!user) throw new NotFoundException("User not found")

        return user
    }

    async updateUser(userId: string, updateData: UpdateUserContractDto | DeepPartial<User>): Promise<User> {
        if (updateData.email && (await this.userRepository.isEmailTaken(updateData.email, userId))) {
            throw new ConflictException('Email already in use');
        }

        const updatedUser = await this.userRepository.update({
            userId,
            deletedAt: IsNull(),
        } as FindOptionsWhere<User>, updateData as DeepPartial<User>);

        if (!updatedUser) throw new NotFoundException("User not found")

        return updatedUser
    }

    async assignRoleToUser(userId: string, roleIds: string[]): Promise<User> {
        return await this.userRepository.addRolesToUser(userId, roleIds);
    }

    async removeRoleFromUser(userId: string, roleId: string): Promise<User> {
        return await this.userRepository.removeRoleFromUser(userId, roleId);
    }


    async findUserByEmail(email: string, withCredentials = false): Promise<Omit<User, 'credentials'> | User | null> {
        const user = await this.userRepository.findOne({
            where: { email: email },
            relations: withCredentials ? ["credentials", "roles"] : ["roles"],
        });

        if (!user) {
            return null;
        }

        if (!withCredentials) {
            const userWithoutCredentials = new User();
            Object.assign(userWithoutCredentials, user);
            delete (userWithoutCredentials as any).credentials;

            return userWithoutCredentials;
        }

        return user;
    }

}
