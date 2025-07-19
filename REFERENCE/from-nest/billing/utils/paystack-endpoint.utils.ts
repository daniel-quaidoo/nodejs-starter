import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export async function callPaystackEndpoint(
    httpService: HttpService,
    configService: ConfigService,
    url: string,
    method: 'POST' | 'GET',
    payload?: any,
    ): Promise<any> {
    try {
        const observable = httpService.request({
            url,
            method,
            data: payload,
            headers: {
                Authorization: `Bearer ${configService.get('PAYSTACK_SECRET_KEY')}`,
                'Content-Type': 'application/json',
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
        error?.response?.data?.message || error?.message || 'An unexpected error occurred';

        return {
            success: false,
            error: message,
            status,
            data: error?.response?.data || null,
        };
    }
}
