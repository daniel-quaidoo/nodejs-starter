import Container from 'typedi';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';

// strategies
import { createJwtStrategy } from './strategies/jwt.strategy';
import { createLocalStrategy } from './strategies/local.strategy';

// service
import { UserService } from '../../modules/auth/users/service/user.service';

// Initialize passport (since we don't have app.use in Lambda)
export const initializePassport = () => {
    return (req: Request, res: Response, next: NextFunction): any => {
        passport.initialize()(req, res, next);
    };
};

/**
 * Configures Passport with serialization, deserialization, and strategies
 * @param userService - User service for database operations
 * @returns Configured Passport instance
 */
export const configurePassport = (): any => {
    const userService = Container.get(UserService);

    // serialize user into the session
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    // deserialize user from the session
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await userService.findOne(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    // configure authentication strategies
    passport.use(createLocalStrategy(userService));
    passport.use(createJwtStrategy(userService));

    return passport;
};

// export middleware for Express
const passportInstance = passport.initialize();
const passportSessionInstance = passport.session();

export const passportMiddleware = passportInstance;
export const passportSessionMiddleware = passportSessionInstance;
