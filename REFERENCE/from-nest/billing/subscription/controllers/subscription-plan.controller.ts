
import { Body, Controller, Post , Get, Param, Patch, Put} from '@nestjs/common';
import { SubscriptionPlanService } from '../services/subscription-plan.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from '../dto/update-subscription-plan.dto';

@ApiTags('Subscription Plan')
@Controller('plan')
export class SubscriptionPlanController {
    constructor(
        private readonly planService: SubscriptionPlanService,
    ){}

    @Post()
    createSubscriptionPlan(
        @Body() subscriptionPlanDto: CreateSubscriptionPlanDto
    ) {
        return this.planService.createSubscriptionPlan(subscriptionPlanDto)
    }

    @Get()
    getAllSubscriptionPlans() {
        return this.planService.getAllSubscriptionPlans()
    }

    @Get(':planId')
    async getSubscriptionPlan(
        @Param('planId') planId: string
    ) {
        return this.planService.getSubscriptionPlanById(planId);
    }

    @Put(':planId')
    updateSubscriptionPlan(
        @Param('planId') planId: string,
        @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto
    ) {
        return this.planService.updateSubscriptionPlan(planId, updateSubscriptionPlanDto);
    }


}
