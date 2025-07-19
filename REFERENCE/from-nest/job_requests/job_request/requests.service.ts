import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobRequest } from './entities/job-requests.entity';
import { CreateJobRequestDto } from '@lib/contracts/job_requests/job_requests/create-job-request.dto';
import { UpdateJobRequestDto } from '@lib/contracts/job_requests/job_requests/update-job-request.dto';
import { ResourcesService } from '../../resources/resources.service';
import { UpdateJobProgressDto } from '@lib/contracts/job_requests/job_requests/update-job-progress.dto';
import { UpdateJobStatusDto } from '@lib/contracts/job_requests/job_requests/update-job-status.dto';


@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(JobRequest)
        private readonly jobRequestRepo: Repository<JobRequest>,
        private readonly resourceService : ResourcesService
    ) {}

    async create(createDto: CreateJobRequestDto): Promise<JobRequest> {

        // Fetch related entities using their IDs from the DTO
        const idDocument = await this.resourceService.findOneMedia(createDto.id_document);
        const tinDocument = await this.resourceService.findOneMedia(createDto.id_document);

        // Build the entity object with resolved relations
        const jobRequest = this.jobRequestRepo.create({
            ...createDto,
            id_document: idDocument,
            tin_document: tinDocument,
        });

        return await this.jobRequestRepo.save(jobRequest);

    }

    async findAll(): Promise<JobRequest[]> {
        return await this.jobRequestRepo.find({ relations: ['user', 'service', 'contact'] });
    }

    async findOne(id: string): Promise<JobRequest> {
        const job = await this.jobRequestRepo.findOne({ where: { id }, relations: ['user', 'service', 'contact'] });
        if (!job) throw new NotFoundException(`Job request with ID ${id} not found`);
        return job;
    }

    async update(id: string, updateDto: UpdateJobRequestDto): Promise<JobRequest> {
        const job = await this.findOne(id);
        Object.assign(job, updateDto);
        return await this.jobRequestRepo.save(job);
    }

    async remove(id: string): Promise<void> {
        const job = await this.findOne(id);
        await this.jobRequestRepo.remove(job);
    }

    async updateProgress(id: string, progressDto: UpdateJobProgressDto): Promise<JobRequest> {
        const job = await this.findOne(id);
        job.progress = progressDto.progress;
        return await this.jobRequestRepo.save(job);
    }

    async updateStatus(id: string, statusDto: UpdateJobStatusDto): Promise<JobRequest> {
        const job = await this.findOne(id);
        job.status = statusDto.status;
        return await this.jobRequestRepo.save(job);
    }

    async findByUser(userId: string): Promise<JobRequest[]> {
        return await this.jobRequestRepo.find({ where: { user: { user_id: userId } }, relations: ['user', 'service'] });
    }

    async findByService(serviceId: string): Promise<JobRequest[]> {
        return await this.jobRequestRepo.find({ where: { service: { id: serviceId } }, relations: ['user', 'service'] });
    }
}
