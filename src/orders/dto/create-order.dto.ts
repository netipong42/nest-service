import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customer_id!: string;

  @IsString()
  @IsNotEmpty()
  order_no!: string;

  @IsString()
  @IsNotEmpty()
  product_name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(99999)
  quantity!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(99999)
  price!: number;

  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
