import { Token } from 'typedi';

export const INJECT_METADATA_KEY = 'inject:tokens';
export const INJECTABLE_METADATA_KEY = 'injectable';

// router
import { UserRouter } from '../../../modules/user/router/user.router';
import { HealthRouter } from '../../../modules/health/router/health.router';

export const USER_ROUTER_TOKEN = new Token<UserRouter>('UserRouter');
export const HEALTH_ROUTER_TOKEN = new Token<HealthRouter>('HealthRouter');