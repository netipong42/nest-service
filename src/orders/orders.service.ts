import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enums/order-status.enum';
import { CustomersService } from 'src/customers/customers.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private customersService: CustomersService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const checkCustomer = await this.customersService.checkCustomerExists(
      createOrderDto.customer_id,
    );

    if (!checkCustomer) {
      return {
        status: 'error',
        message: 'Customer not found',
      };
    }

    const total_amount = createOrderDto.quantity * createOrderDto.price;
    const order = this.orderRepository.create({
      ...createOrderDto,
      total_amount,
    });

    const save = await this.orderRepository.save(order);

    return {
      status: 'success',
      message: 'Order created successfully',
      data: this.toResponseDto(save),
    };
  }

  async findAll(page: number = 1, per_page: number = 2) {
    const skip = (page - 1) * per_page;
    const [data, total] = await this.orderRepository.findAndCount({
      order: {
        created_at: 'ASC',
      },
      skip: skip,
      take: per_page,
    });
    return {
      status: 'success',
      message: 'Get Order successfully',
      data: this.toResponseDtoList(data),
      meta: {
        current_page: page,
        total_page: Math.ceil(total / per_page),
        per_page: per_page,
        total: total,
      },
    };
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOneBy({ id: id });

    if (!order) {
      return {
        status: 'error',
        message: 'Order not found',
      };
    }
    return {
      status: 'success',
      message: 'Order found successfully',
      data: this.toResponseDto(order),
    };
  }

  async update(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findOneBy({ id: id });

    if (!order) {
      return {
        status: 'error',
        message: 'Order not found',
      };
    }
    order.status = status;
    const save = await this.orderRepository.save(order);

    return {
      status: 'success',
      message: 'Order updated successfully',
      data: this.toResponseDto(save),
    };
  }

  async remove(id: string) {
    const order = await this.orderRepository.findOneBy({ id: id });

    if (!order) {
      return {
        status: 'error',
        message: 'Order not found',
      };
    }
    await this.orderRepository.delete(id);

    return {
      status: 'success',
      message: 'Order deleted successfully',
      data: null,
    };
  }

  private toResponseDtoList(orders: Order[]): OrderResponseDto[] {
    return orders.map((order) => this.toResponseDto(order));
  }

  private toResponseDto(order: Order): OrderResponseDto {
    return plainToInstance(OrderResponseDto, order);
  }
}
