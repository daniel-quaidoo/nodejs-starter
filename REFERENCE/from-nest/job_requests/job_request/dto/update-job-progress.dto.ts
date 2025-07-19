
import { IsNumber, Min, Max } from 'class-validator';

export class UpdateJobProgressDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}
