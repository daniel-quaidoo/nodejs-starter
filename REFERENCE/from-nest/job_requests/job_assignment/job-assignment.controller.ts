import { Controller, Post, Get, Delete, Param, Body, ParseUUIDPipe, Patch } from '@nestjs/common';
import { JobAssignmentService } from './job-assignment.service';
import { CreateJobAssignmentDto } from './dto/create-job-assignment.dto';
import { UpdateJobAssignmentDto } from './dto/update-job-assignment.dto';

@Controller('job-request/assignments')
export class JobAssignmentController {
    constructor(private readonly jobAssignmentService: JobAssignmentService) {}

    @Post()
    assign(@Body() dto: CreateJobAssignmentDto) {
        return this.jobAssignmentService.assign(dto);
    }

    @Get('all')
    findAll() {
        return this.jobAssignmentService.findAll();
    }

    @Get('user/:userId')
    findJobsForUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
        return this.jobAssignmentService.findAllJobsAssignedToUser(userId);
    }

    @Get(':jobRequestId/:userId')
    getAssignment(
        @Param('jobRequestId', new ParseUUIDPipe()) jobRequestId: string,
        @Param('userId', new ParseUUIDPipe()) userId: string,
    ) {
        return this.jobAssignmentService.getAssignment(jobRequestId, userId);
    }

    @Patch(':jobRequestId')
    updateAssignedTo(
        @Param('jobRequestId', new ParseUUIDPipe()) jobRequestId: string,
        @Body() dto: UpdateJobAssignmentDto,
    ) {
        return this.jobAssignmentService.updateAssignedTo(jobRequestId, dto);
    }

    @Delete(':jobRequestId/:userId')
    remove(
        @Param('jobRequestId', new ParseUUIDPipe()) jobRequestId: string,
        @Param('userId', new ParseUUIDPipe()) userId: string,
    ) {
        return this.jobAssignmentService.remove(jobRequestId, userId);
    }
}
