import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category/entities/category.entity";
import { CategoryModule } from "./category/category.module";
import { CategoryController } from "./category/category.controller";
import { CategoryService } from "./category/category.service";
import { Service } from "./service/entities/service.entity";
import { ServiceModule } from "./service/service.module";
import { ServiceController } from "./service/service.controller";
import { ServiceService } from "./service/service.service";
import { RequestsController } from "./job_request/requests.controller";
import { RequestsService } from "./job_request/requests.service";
import { JobRequest } from "./job_request/entities/job-requests.entity";
import { RequestsModule } from "./job_request/requests.module";
import { ResourcesModule } from "../resources/resources.module";
import { JobAssignmentModule } from "./job_assignment/job-assignment.module";
import { JobAssignmentService } from "./job_assignment/job-assignment.service";
import { JobAssignmentController } from "./job_assignment/job-assignment.controller";
import { JobAssignment } from "./job_assignment/entities/job-assignment.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([Category,Service, JobRequest, JobAssignment]),
    CategoryModule,
    ServiceModule,
    RequestsModule,
    JobAssignmentModule,
    ResourcesModule,
  ],
  controllers: [ CategoryController, ServiceController, RequestsController, JobAssignmentController],
  providers: [CategoryService, ServiceService, RequestsService, JobAssignmentService],
})
export class JobRequestsModule {}

