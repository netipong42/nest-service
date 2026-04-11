import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CustomersService {
  constructor(private readonly httpService: HttpService) {}

  async checkCustomerExists(customer_id: string): Promise<boolean> {
    try {
      const url = `${process.env.LEGACY_SERVICE_URL}/customers/${customer_id}`;
      const response = await firstValueFrom(this.httpService.get(url));

      if (
        response.data?.status === 'success' &&
        response.data?.data?.id === customer_id
      ) {
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      throw new HttpException(
        'Failed to check customer',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
