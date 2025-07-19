import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { Subscription } from "../entities/subscription.entity";



export class CancelSubscriptionDto {

    @ApiProperty({ description: 'Subscription to be cancelled', type: () => Subscription, example: '0e5224fb-16ae-48ff-9e21-51c28d791152'})
    @IsUUID()
    subscriptionId: string;

}