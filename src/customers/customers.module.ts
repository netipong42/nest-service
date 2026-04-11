import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CustomersService } from './customers.service';

@Module({
  imports: [HttpModule],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
