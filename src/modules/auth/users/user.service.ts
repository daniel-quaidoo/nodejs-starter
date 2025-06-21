import { Inject } from "typedi";
import { FindOneOptions, FindOptionsWhere, DeepPartial } from "typeorm";

// model
import { User } from "./entities/user.entity";
import { BaseService } from "../../../core/common";
import { Role } from "../roles/entities/role.entity";

// repository
import { UserRepository } from "./repository/user.repository";

// service
import { RoleService } from "../roles/role.service";

// decorator
import { Service } from "../../../core/common/di/component.decorator";

// dto
import { CreateUserContractDto } from "../../../shared/auth/users/create-user.dto";
import { UpdateUserContractDto } from "../../../shared/auth/users/update-user.dto";

// exception
import { ConflictException, NotFoundException } from "../../../core/common/exceptions/http.exception";

@Service()
export class UserService extends BaseService<User> {

    constructor(
        @Inject() private roleService: RoleService,
        @Inject() private userRepository: UserRepository,
    ) {
        super(userRepository);
    }

    async createUser(dto: CreateUserContractDto): Promise<User> {
        let roles: Role[] = [];

        if (dto.roles && Array.isArray(dto.roles) && dto.roles.length) {
            roles = await this.roleService.findRolesByIds(dto.roles as string[]);
        }

        const user = this.userRepository.create({
            ...dto,
            roles,
        } as DeepPartial<User>);

        return user
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

        const updatedUser = await this.userRepository.update(userId, updateData as DeepPartial<User>);

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
            relations: withCredentials ? ["credentials"] : [],
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
