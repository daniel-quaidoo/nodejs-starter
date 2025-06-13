import passport from 'passport';

// strategies
import { createLocalStrategy } from './strategies/local.strategy';

// service
import { UserService } from '../../modules/user/service/user.service';

/**
 * Configures Passport with serialization, deserialization, and strategies
 * @param userService - User service for database operations
 * @returns Configured Passport instance
 */
export const configurePassport = (userService: UserService) => {
    // Serialize user into the session
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    // Deserialize user from the session
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await userService.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    // Configure authentication strategies
    passport.use(createLocalStrategy(userService));

    return passport;
};

// Export middleware for Express
const passportInstance = passport.initialize();
const passportSessionInstance = passport.session();

export const passportMiddleware = passportInstance;
export const passportSessionMiddleware = passportSessionInstance;
