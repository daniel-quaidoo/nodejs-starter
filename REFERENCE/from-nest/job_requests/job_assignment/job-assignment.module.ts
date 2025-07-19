import { forwardRef, Module } from "@nestjs/common";
import { JobAssignment } from "./entities/job-assignment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobAssignmentController } from "./job-assignment.controller";
import { JobAssignmentService } from "./job-assignment.service";
import { JobRequestsModule } from "../job-requests.module";
import { JobRequest } from "../job_request/entities/job-requests.entity";


@Module({
    imports: [TypeOrmModule.forFeature([JobAssignment, JobRequest]),
        forwardRef(() => JobRequestsModule),
    ],
    controllers: [
        JobAssignmentController,],
    providers: [
        JobAssignmentService,]
})
export class JobAssignmentModule { }
