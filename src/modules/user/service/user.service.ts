// model
import { User } from '../entities/user.entity';

// repository
import { UserRepository } from '../repository/user.repository';

// service
import { BaseService } from '../../../core/common/service/base.service';

// decorator
import { Component, COMPONENT_TYPE } from "../../../core/common/di/component.decorator";

// exceptions
import { ConflictException, NotFoundException } from '../../../core/common/exceptions/http.exception';

@Component({ type: COMPONENT_TYPE.SERVICE })
export class UserService extends BaseService<User> {
    constructor(private userRepository: UserRepository) {
        super(userRepository);
    }
    
    async create(userData: Partial<User>): Promise<User> {
        if (userData.email && await this.userRepository.isEmailTaken(userData.email)) {
            throw new ConflictException('Email already in use');
        }
        return this.userRepository.create(userData);
    }

    async updateUser(id: string, updateData: Partial<User>): Promise<User> {
        if (updateData.email && await this.userRepository.isEmailTaken(updateData.email, id)) {
            throw new ConflictException('Email already in use');
        }
        
        await this.userRepository.update(id, updateData);
        const updatedUser = await this.userRepository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new NotFoundException('User not found after update');
        }
        return updatedUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async findActiveUsers(): Promise<User[]> {
        return this.userRepository.findActiveUsers();
    }

    async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
        return this.userRepository.isEmailTaken(email, excludeId);
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.softDelete(id);
    }
}