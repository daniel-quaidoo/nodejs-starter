import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';

import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { UpdateJobRequestDto } from './dto/update-job-request.dto';
import { JobStatusEnum } from '@lib/contracts/job_requests/enums/job-status.enum';
import { RequestsService } from './requests.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateJobProgressDto } from './dto/update-job-progress.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';

@ApiTags('Job Requests')
@Controller('job-request')
export class RequestsController {
    constructor(private readonly jobRequestService: RequestsService) {}

    @Post()
    create(@Body() createJobRequestDto: CreateJobRequestDto) {
        return this.jobRequestService.create(createJobRequestDto);
    }

    @Get()
    findAll() {
        return this.jobRequestService.findAll();
    }

    @Get(':jobRequestId')
    findOne(@Param('jobRequestId', new ParseUUIDPipe()) jobRequestId: string) {
        return this.jobRequestService.findOne(jobRequestId);
    }

    @Patch(':jobRequestId')
    update(
        @Param('jobRequestId', new ParseUUIDPipe()) jobRequestId: string,
        @Body() updateJobRequestDto: UpdateJobRequestDto,
    ) {
        return this.jobRequestService.update(jobRequestId, updateJobRequestDto);
    }

    @Delete(':jobRequestId')
    remove(@Param('jobRequestId', new ParseUUIDPipe()) jobRequestId: string) {
        return this.jobRequestService.remove(jobRequestId);
    }

    @Patch(':jobRequestId/progress')
    updateProgress(
        @Param('jobRequestId', new ParseUUIDPipe()) jobRequestId: string,
        @Body() progressDto: UpdateJobProgressDto,
    ) {
        return this.jobRequestService.updateProgress(jobRequestId, progressDto);
    }

    @Patch(':jobRequestId/status')
    updateStatus(
        @Param('jobRequestId', new ParseUUIDPipe()) jobRequestId: string,
        @Body() statusDto: UpdateJobStatusDto,
    ) {
        return this.jobRequestService.updateStatus(jobRequestId, statusDto);
    }

    @Get('user/:userId')
    findByUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
        return this.jobRequestService.findByUser(userId);
    }

    @Get('service/:serviceId')
    findByService(@Param('serviceId', new ParseUUIDPipe()) serviceId: string) {
        return this.jobRequestService.findByService(serviceId);
    }
}
