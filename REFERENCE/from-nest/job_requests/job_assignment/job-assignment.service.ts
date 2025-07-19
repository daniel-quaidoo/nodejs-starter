
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobAssignment } from './entities/job-assignment.entity';
import { CreateJobAssignmentDto } from '@lib/contracts/job_requests/job_assignments/create-job-assignment.dto';
import { UpdateJobAssignmentDto } from '@lib/contracts/job_requests/job_assignments/update-job-assignment.dto';
import { JobRequest } from '../job_request/entities/job-requests.entity';


@Injectable()
export class JobAssignmentService {
    constructor(
        @InjectRepository(JobAssignment)
        private readonly assignmentRepo: Repository<JobAssignment>,
        @InjectRepository(JobRequest)
        private readonly jobRequestRepo: Repository<JobRequest>,

    ) {}

    async assign(dto: CreateJobAssignmentDto): Promise<JobAssignment> {
        const jobRequest = await this.jobRequestRepo.findOneByOrFail({ id: dto.jobRequestId });
      

        const assignment = this.assignmentRepo.create({
            jobRequest: jobRequest,
            assigned_to: dto.assigned_to,
        });

        return this.assignmentRepo.save(assignment);
    }


    async findAll(): Promise<JobAssignment[]> {
        return this.assignmentRepo.find();
    }


    async findAllJobsAssignedToUser(userId: string): Promise<JobAssignment[]> {
        return this.assignmentRepo.find({ where: { assigned_to: userId } });
    }

    async remove(jobRequestId: string, assignedTo: string): Promise<void> {
        await this.assignmentRepo.delete({ job_request_id: jobRequestId, assigned_to: assignedTo });
    }


    async getAssignment(jobRequestId: string, assignedTo: string): Promise<JobAssignment> {
        const assignment = await this.assignmentRepo.findOneBy({ job_request_id: jobRequestId, assigned_to: assignedTo });
        if (!assignment) throw new NotFoundException('Assignment not found');
        return assignment;
    }

    async updateAssignedTo( jobRequestId: string, updateDto: UpdateJobAssignmentDto): Promise<JobAssignment> {

        const assignment = await this.assignmentRepo.findOneBy({ job_request_id: jobRequestId, assigned_to: updateDto.old_assigned_to });
        if (!assignment) throw new NotFoundException('Assignment not found');

        if (updateDto.old_assigned_to === updateDto.new_assigned_to) {
            throw new Error('New assigned user must be different from the old one');
        }

        assignment.assigned_to = updateDto.new_assigned_to;
        return this.assignmentRepo.save(assignment);
    }
}
