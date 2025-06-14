import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// config
import { ConfigService } from '../../../config/configuration';

// service
import { UserService } from '../../../modules/user/service/user.service';

const configService = new ConfigService();

// JWT strategy
export const createJwtStrategy = (userService: UserService) => {
    return new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
            ignoreExpiration: false,
            passReqToCallback: true
        },
        async (req: any, payload: any, done: any) => {
            try {
                const user = await userService.findById(payload.sub);
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    );
};