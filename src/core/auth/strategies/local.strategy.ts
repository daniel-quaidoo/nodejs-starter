import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy, IVerifyOptions } from 'passport-local';

// service
import { UserService } from '../../../modules/user/service/user.service';

/**
 * Local authentication strategy using email and password
 * @param userService - User service for database operations
 * @returns Configured LocalStrategy instance
 */
export const createLocalStrategy = (userService: UserService) => {
    return new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => {
            try {
                const user = await userService.findByEmail(email);

                if (!user) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                const isValidPassword = await bcrypt.compare(password, user.password);

                if (!isValidPassword) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    );
};
