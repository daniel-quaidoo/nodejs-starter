
import { Controller, Post, Body, HttpException, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from '../services/subscription.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { CancelSubscriptionDto } from '../dto/cancel-subscription.dto';

@ApiTags('Subscription')
@Controller()
export class SubscriptionController {
    constructor(
        private readonly subscriptionService: SubscriptionService,
    ) { }  
    
    @Post()
    createSubscription(@Body() dto: CreateSubscriptionDto) {
        return this.subscriptionService.subscribeUser(dto);
    }

    @Post('initialize')
    async initializeSubscriptionManually(
        @Body() dto: CreateSubscriptionDto
    ) {
        const [user, plan] = await this.subscriptionService.validateUserandPlan(dto);
        const response = await this.subscriptionService.initializeSubscription(user.email, plan.providerPlanCode, 1);

        if (!response.success) {
            throw new HttpException(response.error, response.status);
        }

        return {
            message: "Transaction initialized. Awaiting payment to activate subscription.",
            data: response.data,
        };
    }

    @Get('')
    getAllSubscriptions() {
        return this.subscriptionService.getAllSubscriptions();
    }
    
    @Get(':subscriptionId')
    getSubscriptionById(
        @Param('subscriptionId') subscriptionId: string
    ) {
        return this.subscriptionService.getSubscriptionById(subscriptionId);
    }

    @Post('cancel')
    cancelSubscription(
        @Body() dto: CancelSubscriptionDto
    ) {
        return this.subscriptionService.cancelSubscription(dto);
    }
    
}
