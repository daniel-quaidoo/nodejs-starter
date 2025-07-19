import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";

import { HttpService } from "@nestjs/axios";

import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from 'rxjs';

import { CreateSubscriptionDto } from "@lib/contracts/billing/subscription/create-subscription.dto";
import { Subscription } from "../entities/subscription.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../../auth/users/entities/user.entity";
import { Repository } from "typeorm";
import { SubscriptionStatusEnum } from "@lib/contracts/billing/enums/subscription-status.enum";
import { SubscriptionPlan } from "../entities/subscription-plan.entity";
import { PayStackErrorCodeEnum } from "@lib/contracts/billing/enums/paystack-error-code.enum";
import { CancelSubscriptionDto } from "@lib/contracts/billing/subscription/cancel-subscription.dto";


@Injectable()
export class SubscriptionService {
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Subscription)
        private readonly subscriptionRepo: Repository<Subscription>,
        @InjectRepository(SubscriptionPlan)
        private readonly planRepo: Repository<SubscriptionPlan>
    ) {}



    async subscribeUser(dto: CreateSubscriptionDto): Promise<any> {
        
        // Validate user and plan
        const [user, plan] = await this.validateUserandPlan(dto);

        //Get the plan code from the plan
        const payStackPlanCode = plan.providerPlanCode;

        // Get customer code from Paystack
        const customerCode = await this.getCustomerCodeByEmail(user.email);


        //Sign the user up for the subscription
        const subscriptionResponse = await this.createSubscription(payStackPlanCode,customerCode);

        if (
            !subscriptionResponse.success &&
            subscriptionResponse.data?.status === false &&
            subscriptionResponse.data?.code === PayStackErrorCodeEnum.NoActiveAuthorizations
        ) 
        {
        this.logger.warn("No active authorization found. Initializing transaction instead.");

        const initializeResponse = await this.initializeSubscription(user.email, payStackPlanCode, 500);
        // console.log(`initializeResponse:`, initializeResponse);

        if (!initializeResponse.success) {
            throw new HttpException(
                `Failed to initialize transaction: ${initializeResponse.error}`,
                initializeResponse.status,
            );
        }

        //If transaction was initialized successfully, save to db as pending
        await this.savePendingSubscriptionToDB(user, plan);

        return {
            message: "Transaction initialized instead of direct subscription",
            data: initializeResponse.data,
        };

        }

        // If subscription was not successful
        if (!subscriptionResponse.success) {
            throw new HttpException(
                `Failed to create subscription: ${subscriptionResponse.error}`,
                subscriptionResponse.status,
            );
        }

        // If subscription was successful save to db as pending
        await this.savePendingSubscriptionToDB(user, plan);

        return {
            message: "Subscription successfully created",
            data: subscriptionResponse.data,
        };
            
        }

    private async callPaystackEndpoint(url: string, method: "POST" | "GET", payload?: any): Promise<any> {

        try {
            const observable = this.httpService.request({
                url,
                method,
                data: payload,
                headers: {
                    Authorization: `Bearer ${this.configService.get("PAYSTACK_SECRET_KEY")}`,
                    "Content-Type": "application/json",
                },
            });

            const response = await lastValueFrom(observable);

            return {
                success: true,
                data: response.data,
                status: response.status,
            };

        } catch (error) {
            const status = error?.response?.status || 500;
            const message =
            error?.response?.data?.message || error?.message || "An unexpected error occurred";

            // this.logger.error(`Paystack Error: ${message}`, error?.stack || '');

            return {
                success: false,
                error: message,
                status,
                data: error?.response?.data || null,
            };
        }
    }


    private async getCustomerCodeByEmail(email: string): Promise<any>{

        const fetchResponse = await this.callPaystackEndpoint(
            `https://api.paystack.co/customer/${email}`, 
            "GET"
        );
       
        if(fetchResponse.success && fetchResponse.data?.data?.customer_code){
            return fetchResponse.data?.data?.customer_code;
        }

        // If the customer code is not found, create a new customer
        const createResponse = await this.callPaystackEndpoint(
            `https://api.paystack.co/customer`, 
            "POST",
            {
                email: email
            }
        );

        if (!createResponse.success || !createResponse.data?.data?.customer_code) {
            throw new HttpException(`Failed to create new customer on Paystack: ${createResponse.error}`, fetchResponse.status);
        }

        return createResponse.data?.data?.customer_code;
    }


    private async createSubscription(paystackPlanCode: string, customerCode: string): Promise<any> {

        const subscriptionResponse = await this.callPaystackEndpoint(
            `https://api.paystack.co/subscription`,
            "POST",
            {
                customer: customerCode,
                plan: paystackPlanCode,
            }
        );
        return subscriptionResponse;
    }

    async initializeSubscription(email:string,paystackPlanCode:string, amount:number): Promise<any>{

        //get the callback url from the config
        const callbackBase = this.configService.get('PAYSTACK_CALLBACK_BASE');
        const callbackUrl = `${callbackBase}/billing/payment/paystack/callback/subscription`;


        const transResponse = await this.callPaystackEndpoint(
            `https://api.paystack.co/transaction/initialize`,   
            "POST",
            {
                email: email,
                plan: paystackPlanCode,
                amount: amount * 100, 
                callback_url: callbackUrl,
            }
        );

        return transResponse;
    }

    async validateUserandPlan(dto: CreateSubscriptionDto): Promise<[User, SubscriptionPlan]> {
        // Validate user
        const user = await this.userRepo.findOneBy({ user_id: dto.user_id });
        if (!user)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);

        //  Validate plan
        const plan = await this.planRepo.findOneBy({ id: dto.plan_id });
        if (!plan)
            throw new HttpException("Plan not found", HttpStatus.NOT_FOUND);

        return [user, plan];
    }

    private async saveActiveSubscriptionToDB(
        user: User,
        plan: SubscriptionPlan,
        subscriptionResponse: any
        ): Promise<Subscription> {
        const data = subscriptionResponse?.data?.data;

        if (!data?.subscription_code || !data?.authorization) {
            throw new Error("Missing subscription code or authorization code from Paystack response");
        }

        const subscription = this.subscriptionRepo.create({
            user,
            plan,
            providerSubscriptionCode: data.subscription_code,
            authorizationCode: data.authorization,
            nextPaymentDate: data.next_payment_date,
            start_date: data.createdAt,
            updatedAt: data.updatedAt,
            status: SubscriptionStatusEnum.Active,
        });

        return await this.subscriptionRepo.save(subscription);
    }

    private async savePendingSubscriptionToDB(
        user: User,
        plan: SubscriptionPlan
        ): Promise<Subscription> {

        const timestamp = new Date().toISOString().replace(/\D/g, ''); 

        const subscription = this.subscriptionRepo.create({
            user,
            plan,
            providerSubscriptionCode: `PENDING-${timestamp}`,
            authorizationCode: `PENDING-${timestamp}`,
            nextPaymentDate: new Date(),
            start_date: new Date(),
            updatedAt: new Date(),
            status: SubscriptionStatusEnum.Pending,
        });

        return await this.subscriptionRepo.save(subscription);
    }


    async getAllSubscriptions(): Promise<Subscription[]> {

        return this.subscriptionRepo.find({
            relations: {
                user: true,
                plan: true,
            },
        });
    }

    async getSubscriptionById(subscriptionId: string): Promise<Subscription> {
        const subscription = await this.subscriptionRepo.findOne({
            where: { id: subscriptionId },
            relations: {
                user: true,
                plan: true,
            },
        });

        if (!subscription) {
            throw new HttpException(
                {
                    success: false,
                    error: "Subscription not found",
                    data: null,
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return subscription;
    }

    async cancelSubscription(dto: CancelSubscriptionDto): Promise<any> {
        this.logger.log(`Attempting to cancel subscription with ID: ${dto.subscriptionId}`);

        const subscription = await this.subscriptionRepo.findOneBy({ id: dto.subscriptionId });
        if (!subscription) {
            // this.logger.warn(`Subscription not found for ID: ${dto.subscriptionId}`);
            throw new HttpException(
                {
                    success: false,
                    error: "Subscription not found",
                    data: null,
                },
                HttpStatus.NOT_FOUND,
            );
        }

        const paystackSubscriptionCode = subscription.providerSubscriptionCode;

        // this.logger.log(`Fetching subscription from Paystack with code: ${paystackSubscriptionCode}`);
        const fetchResponse = await this.callPaystackEndpoint(
            `https://api.paystack.co/subscription/${paystackSubscriptionCode}`,
            'GET'
        );

        if (!fetchResponse.success) {
            // this.logger.error(`Failed to fetch subscription from Paystack: ${fetchResponse.error}`);
            throw new HttpException(
                `Failed to fetch subscription from Paystack: ${fetchResponse.error}`,
                fetchResponse.status,
            );
        }
    

        this.logger.log(`Disabling subscription on Paystack with code: ${paystackSubscriptionCode}`);

        const cancelResponse = await this.callPaystackEndpoint(
            `https://api.paystack.co/subscription/disable`,
            'POST',
            {
                code: paystackSubscriptionCode,
                token: fetchResponse.data.data.email_token,
            }
        );

        if (!cancelResponse.success) {
            this.logger.error(`Failed to cancel subscription on Paystack: ${cancelResponse.error}`);
            throw new HttpException(
                `Failed to cancel subscription on Paystack: ${cancelResponse.error}`,
                cancelResponse.status,
            );
        }

        this.logger.log(`Subscription with ID: ${dto.subscriptionId} successfully cancelled`);
        return {
            message: "Subscription successfully cancelled",
            data: cancelResponse.data,
        };
    }
}

    




    

