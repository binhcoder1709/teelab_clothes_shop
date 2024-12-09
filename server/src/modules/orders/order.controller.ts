import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { OrderDto } from 'src/dto/order/order.dto';
import { JwtAuthGuard } from 'src/share/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly jwtService: JwtService
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async getAllOrdersController(
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<Order[]> {
    return await this.orderService.getAllOrdersService(page, limit);
  }

  @Get('/new')
  @HttpCode(200)
  async getAllNewOrdersController(
    @Query('status') status: number
  ): Promise<Order[]> {
    return await this.orderService.getAllNewOrdersService(status);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(200)
  async getOrderByIdController(@Param('id') orderId: string): Promise<Order> {
    return await this.orderService.getOrderByIdService(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @HttpCode(200)
  async updateStatusController(
    @Param('id') orderId: string,
    @Body() data: any
  ): Promise<Order> {
    return await this.orderService.updateStatusService(orderId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @HttpCode(201)
  async createOrder(
    @Body() data: any,
    @Headers('Authorization') header: string
  ): Promise<Order> {
    const token = header.replace('Bearer ', '');
    console.log(token);

    if (!token) {
      throw new UnauthorizedException('Not found token');
    }
    const payloadToken = this.jwtService.decode(token);
    console.log(payloadToken);

    return await this.orderService.createOrderService(
      data,
      payloadToken.user_id
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(200)
  async deleteOrderController(
    @Headers('authorization') header: string,
    @Param('id') orderId: string
  ) {
    const tokenSplit = header.split(' ')[1];
    if (!tokenSplit) {
      throw new UnauthorizedException('Not found token');
    }
    return await this.orderService.deleteOrderService(tokenSplit, orderId);
  }
}
