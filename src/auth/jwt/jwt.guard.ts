import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(
        'Missing or invalid token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token: string = authHeader.split(' ')[1];
    try {
      const url = `${process.env.LEGACY_SERVICE_URL}/auth/check-token`;
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      if (response.data.status !== 'success') {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      request.user = response.data.data;
      return true;
    } catch (err: any) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
