import bcrypt from 'bcrypt';
import { Inject, Service } from 'typedi';

// model
import { User } from '../entities/user.entity';

// repository
import { UserRepository } from '../repository/user.repository';

// service
import { BaseService } from '../../../core/common/service/base.service';

// decorator
import { Component, COMPONENT_TYPE } from '../../../core/common/di/component.decorator';

// exception
import {
    ConflictException,
    NotFoundException,
} from '../../../core/common/exceptions/http.exception';

@Service()
@Component({ type: COMPONENT_TYPE.SERVICE })
export class UserService extends BaseService<User> {
    private readonly SALT_ROUNDS = 10;

    constructor(@Inject() private userRepository: UserRepository) {
        super(userRepository);
    }

    async create(userData: Partial<User>): Promise<User> {
        if (userData.email && (await this.userRepository.isEmailTaken(userData.email))) {
            throw new ConflictException('Email already in use');
        }
        return this.userRepository.create(userData);
    }

    async updateUser(id: string, updateData: Partial<User>): Promise<User> {
        if (updateData.email && (await this.userRepository.isEmailTaken(updateData.email, id))) {
            throw new ConflictException('Email already in use');
        }

        // Hash new password if provided
        if (updateData.password) {
            updateData.password = await this.hashPassword(updateData.password);
        }

        await this.userRepository.update(id, updateData);
        const updatedUser = await this.userRepository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new NotFoundException('User not found after update');
        }
        return updatedUser;
    }

    /**
     * Hash a password
     */
    private async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
        return hashedPassword;
    }

    /**
     * Validate user credentials
     */
    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        return user;
    }

    async findActiveUsers(): Promise<User[]> {
        const users = await this.userRepository.findActiveUsers();
        return users;
    }

    async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
        const isTaken = await this.userRepository.isEmailTaken(email, excludeId);
        return isTaken;
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
