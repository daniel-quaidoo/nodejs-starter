import { Entity, ManyToOne, PrimaryColumn, JoinColumn, CreateDateColumn } from 'typeorm';
import { JobRequest } from '../../job_request/entities/job-requests.entity';
import { User } from '../../../auth/users/entities/user.entity';


@Entity('job_assignments')
export class JobAssignment {
    @PrimaryColumn()
    job_request_id: string;

    @PrimaryColumn()
    assigned_to: string;

    @ManyToOne(() => JobRequest, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_request_id' })
    jobRequest: JobRequest;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'assigned_to' })
    assignedTo: User;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;
}
