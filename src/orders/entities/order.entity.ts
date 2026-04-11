import { Transform } from 'class-transformer';
import dayjs from 'dayjs';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customer_id!: string;

  @Column()
  order_no!: string;

  @Column()
  product_name!: string;

  @Column('int')
  quantity!: number;

  @Column('float')
  price!: number;

  @Column('float')
  total_amount!: number;

  @Column()
  status!: string;

  @CreateDateColumn()
  @Transform(({ value }) =>
    dayjs(value as string).format('YYYY-MM-DD HH:mm:ss'),
  )
  created_at!: Date;

  @UpdateDateColumn()
  @Transform(({ value }) =>
    dayjs(value as string).format('YYYY-MM-DD HH:mm:ss'),
  )
  updated_at!: Date;
}
