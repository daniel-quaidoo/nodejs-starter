import { Module } from "../../core/common/di/module.decorator";

// service
import { UserService } from "./service/user.service";

// controller
import { UserController } from "./controller/user.controller";

// repository
import { UserRepository } from "./repository/user.repository";

@Module({
    repositories: [UserRepository],
    controllers: [UserController],
    services: [UserService],
})
export class UserModule {}