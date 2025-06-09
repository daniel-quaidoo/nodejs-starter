import { Inject, Container } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';

// entity
import { User } from '../entities/user.entity';

// controller
import { UserController } from '../controller/user.controller';

// router
import { BaseRouter } from '../../../core/common/router/base.router';

// token
import { USER_ROUTER_TOKEN } from '../../../core/common/di/di-token.constant';

// decorator
import { Component, COMPONENT_TYPE } from "../../../core/common/di/component.decorator";

// interface
import { IModuleRouter, RouteDefinition } from '../../../core/common/interfaces/route.interface';

@Component({ type: COMPONENT_TYPE.ROUTER })
export class UserRouter extends BaseRouter<User> implements IModuleRouter {
    public Token = USER_ROUTER_TOKEN;
    public static Token = USER_ROUTER_TOKEN;

    constructor(@Inject() protected readonly controller: UserController) {
        super(controller);
    }

    public static getRouter(): Router {
        const controller = Container.get(UserController);
        return new UserRouter(controller).router;
    }

    /**
     * Override to add custom routes
     * These will be prefixed with '/user' automatically
     */
    protected getCustomRoutes(): RouteDefinition[] {
        return [
            {
                method: 'GET',
                path: '/users',
                handler: (req: Request, res: Response, next: NextFunction) => this.controller.getAllUsers(req, res, next),
                absolutePath: true
            },
            {
                method: 'POST',
                path: '/users',
                handler: (req: Request, res: Response, next: NextFunction) => this.controller.createUser(req, res, next),
                absolutePath: true
            }
        ];
    }

}