
import { JobStatusEnum } from '@lib/contracts/job_requests/enums/job-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateJobStatusDto {
  @IsEnum(JobStatusEnum)
  status: JobStatusEnum;
}
