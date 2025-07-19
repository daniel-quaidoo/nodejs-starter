import { PartialType } from "@nestjs/mapped-types";
import { CreateSubscriptionPlanDto } from "./create-subscription-plan.dto";
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateSubscriptionPlanDto extends PartialType( CreateSubscriptionPlanDto) {

    @IsOptional()
    @IsBoolean()
    update_existing_subscriptions?: boolean;

}