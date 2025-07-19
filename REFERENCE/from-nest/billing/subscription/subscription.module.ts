import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';

import { Module } from '@nestjs/common';
import { SubscriptionPlanController } from './controllers/subscription-plan.controller';
import { SubscriptionPlanService } from './services/subscription-plan.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../../auth/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Subscription, SubscriptionPlan]),
        HttpModule,
        UsersModule,
    ],
    controllers: [
        SubscriptionController, 
        SubscriptionPlanController],
    providers: [
        SubscriptionService, 
        SubscriptionPlanService ],
    exports: [
        SubscriptionService, SubscriptionPlanService, TypeOrmModule ]
})
export class SubscriptionModule { }
