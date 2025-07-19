import { ApiProperty } from "@nestjs/swagger";
import { IsString} from "class-validator";

export class VerifyPaymentDto {
 
  @ApiProperty({description: 'The reference of transaction from paystack',example: 're4lyvq3s3',})
  @IsString()
  reference_number: string;

}