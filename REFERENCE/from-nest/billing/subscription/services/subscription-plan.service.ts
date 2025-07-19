import { Injectable,  HttpException, HttpStatus } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { CreateSubscriptionPlanDto } from '@lib/contracts/billing/subscription/create-subscription-plan.dto';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';

import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSubscriptionPlanDto } from '@lib/contracts/billing/subscription/update-subscription-plan.dto';


@Injectable()
export class SubscriptionPlanService {
    constructor(
        @InjectRepository(SubscriptionPlan)
        private readonly planRepo: Repository<SubscriptionPlan>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ){}

    async createSubscriptionPlan(dto: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {

        try {
            const response = await this.httpService.axiosRef.post(
            'https://api.paystack.co/plan',
            {
                name: dto.name,
                interval: dto.interval,
                amount: dto.amount * 100,
                description: dto.description,
                invoice_limit: dto.invoice_limit,
            },
            {
                headers: {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
                'Content-Type': 'application/json',
                },
            }
            );

            const paystackPlanData = response.data.data;

            if (response.data.status === true) {
            const subscriptionPlan = this.planRepo.create({
                ...dto,
                isActive: true,
                providerPlanCode: paystackPlanData.plan_code,
                createdAt: paystackPlanData.createdAt,
                updatedAt: paystackPlanData.updatedAt,
            });

            return this.planRepo.save(subscriptionPlan);
            }

            throw new Error('Plan creation failed on Paystack');

        } catch (error) {
            
            if (error.response) {

                throw new HttpException(
                    {
                        success: false,
                        error: error.response.data.message || 'Paystack rejected the request',
                        data: null
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            throw new HttpException(
                {
                    success: false,
                    error: 'Unexpected error occurred',
                    data: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        return this.planRepo.find();
    }

    async getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan> {
        const plan = await this.planRepo.findOne({ where: { id: planId} });
        if (!plan) {
            throw new HttpException(
                {
                    success: false,
                    error: 'Subscription plan not found',
                    data: null
                },
                HttpStatus.NOT_FOUND,
            );
        }
        return plan;
    }

    async updateSubscriptionPlan(planId: string, dto: UpdateSubscriptionPlanDto): Promise< SubscriptionPlan>{
        try{
            const existingPlan = await this.planRepo.findOneByOrFail({ id: planId });

            const response = await this.httpService.axiosRef.put(
                `https://api.paystack.co/plan/${existingPlan.providerPlanCode}`,
                {
                    ...dto,
                    amount : dto.amount ? dto.amount * 100 : undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response.data.status === true) {
                const updatedPlan = this.planRepo.merge(existingPlan, {
                    ...dto,
                    amount: dto.amount ? dto.amount : undefined,
                    updatedAt: new Date(),
                });

                return this.planRepo.save(updatedPlan);
            }

            throw new Error('Plan update failed on Paystack');
        } catch(error){
            if(error.response){
                throw new HttpException(
                    {
                        success: false,
                        error: error.response.data.message || 'Paystack rejected the update',
                        data: null
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            throw new HttpException(
                {
                    success: false,
                    error: 'Unexpected error occurred',
                    data: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }

}
