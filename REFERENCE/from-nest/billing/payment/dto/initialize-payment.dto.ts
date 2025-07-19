import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, IsUUID } from "class-validator";

export class InitializePaymentDto {
 
  @ApiProperty({description: 'The ID of the invoice',example: 'INV-202505082326110251',})
  @IsString()
  invoiceId: string;

}
  