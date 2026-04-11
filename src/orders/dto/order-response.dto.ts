import { Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class OrderResponseDto {
  id!: string;
  customer_id!: string;
  order_no!: string;
  product_name!: string;
  quantity!: number;
  price!: number;
  total_amount!: number;
  status!: string;

  @Transform(({ value }) =>
    dayjs(value as string).format('YYYY-MM-DD HH:mm:ss'),
  )
  created_at!: Date;

  @Transform(({ value }) =>
    dayjs(value as string).format('YYYY-MM-DD HH:mm:ss'),
  )
  updated_at!: Date;
}
