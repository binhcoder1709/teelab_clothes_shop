import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderDto } from 'src/dto/order/order.dto';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderDetail.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserRepository } from '../users/user.repository';
import { ProductRepository } from '../products/product.repository';
import { Size } from 'src/entities/size.entity';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OrderRepository {
  private orderRepos: Repository<Order>;
  private orderDetailRepos: Repository<OrderDetail>;
  private sizeRepos: Repository<Size>;
  private productRepos: Repository<Product>;
  private userRepos: Repository<User>;

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    private readonly mailerService: MailerService
  ) {
    this.orderRepos = dataSource.getRepository(Order);
    this.orderDetailRepos = dataSource.getRepository(OrderDetail);
    this.sizeRepos = dataSource.getRepository(Size);
    this.productRepos = dataSource.getRepository(Product);
    this.userRepos = dataSource.getRepository(User);
  }

  formatPrice(p: number) {
    const price = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(p);
    return price;
  }

  async sendOrderConfirmationEmail(order: Order): Promise<void> {
    let productDetails = '';

    // Loop through each order detail to build the product list
    for (const detail of order.order_details) {
      productDetails += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${detail.product.product_name}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${detail.color.color_name}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${detail.size.size_name}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${detail.quantity}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${this.formatPrice(detail.product.price)}</td>
      </tr>
    `;
    }

    const template = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>Xác nhận đơn hàng</h1>
      <p>Hi ${order.name},</p>
      <p>Cảm ơn bạn đã đặt hàng, Mã đơn hàng của bạn là: <strong>${order.order_id}</strong>.</p>
      <h2>Địa chỉ nhận hàng:</h2>
      <p>Tỉnh/Thành phố: ${order.city}</p>
      <p>Quận/Huyện: ${order.district}</p>
      <p>Phường/Xã: ${order.ward}</p>
      <p>Địa chỉ: ${order.address}</p>
      <p>Số điện thoại: ${order.phone}</p>
      <p>Ghi chú: ${order.note}</p>
      <h2>Chi tiết sản phẩm:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center">Tên sản phẩm</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center">Màu</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center">Size</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center">SLượng</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${productDetails}
        </tbody>
      </table>
      <p>Phí vận chuyển: 20.000 đ</p>
      <p><strong>Tổng giá trị đơn hàng: </strong>${this.formatPrice(order.total_amount)}</p>
      <p>Cảm ơn bạn đã tin tưởng và ủng hộ Teelab</p>
    </div>`;
    await this.mailerService.sendMail({
      to: order.email,
      subject: 'Order Confirmation',
      html: template,
      context: {
        orderId: order.order_id,
        name: order.name,
      },
    });
  }

  async findAll(page: number, limit: number): Promise<Order[]> {
    let result;
    if (page && limit) {
      const [orders, totalItems] = await this.orderRepos.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        relations: [
          'order_details',
          'user',
          'order_details.product',
          'order_details.product.category',
          'order_details.size',
          'order_details.color',
        ],
        order: {
          created_at: 'DESC',
        },
      });
      result = {
        data: orders,
        totalItems,
        currentPage: page,
        pageSize: limit,
      };
    } else {
      result = await this.orderRepos.find({
        relations: [
          'order_details',
          'user',
          'order_details.product',
          'order_details.product.category',
          'order_details.size',
          'order_details.color',
        ],
      });
    }

    return result;
  }

  async findAllStatusOrder(status: number): Promise<Order[]> {
    let result;
    const orders = await this.orderRepos.find({
      where: { status: status },
      relations: [
        'order_details',
        'user',
        'order_details.product',
        'order_details.product.category',
        'order_details.size',
        'order_details.color',
      ],
      order: {
        created_at: 'DESC',
      },
    });
    result = {
      data: orders,
      totalItems: orders.length,
      currentPage: 1,
      pageSize: orders.length,
    };
    return result;
  }

  async findById(orderId: string): Promise<Order> {
    console.log(orderId);

    return await this.orderRepos.findOne({
      where: { order_id: orderId },
      relations: [
        'order_details',
        'order_details.product',
        'order_details.product.category',
        'order_details.size',
        'order_details.color',
      ],
    });
  }
  async updateStatus(orderId: string, data: any): Promise<Order> {
    const order = await this.orderRepos.findOne({
      where: { order_id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = data.status;
    await this.orderRepos.save(order);
    return order;
  }

  async createOne(data: any, id: any): Promise<Order> {
    try {
      const user = await this.userRepos.findOne({
        where: { user_id: id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const order = this.orderRepos.create({
        total_amount: data.total_amount,
        note: data.note || '',
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        district: data.district,
        ward: data.ward,
        status: data.status,
        user: user,
      });
      console.log('Tạo đơn hàng:', order);

      // Lưu đơn hàng chính vào cơ sở dữ liệu
      await this.orderRepos.save(order);
      console.log('Đơn hàng đã được lưu vào cơ sở dữ liệu');

      // Xử lý các mục hàng trong đơn hàng
      for (const item of data.items) {
        const orderDetail = this.orderDetailRepos.create({
          order: order,
          product: item.product,
          color: item.color,
          size: item.size,
          quantity: item.count,
        });
        console.log('Tạo chi tiết đơn hàng:', orderDetail);
        await this.orderDetailRepos.save(orderDetail);
        console.log('Chi tiết đơn hàng đã được lưu vào cơ sở dữ liệu');

        const sizeQuantity = await this.sizeRepos.findOneBy({
          size_id: item.size.size_id,
        });
        if (sizeQuantity) {
          sizeQuantity.quantity -= item.count;
          await this.sizeRepos.save(sizeQuantity);
          console.log('Cập nhật số lượng size:', sizeQuantity);
        }
      }

      const populatedOrder = await this.orderRepos.findOne({
        where: { order_id: order.order_id },
        relations: [
          'order_details',
          'order_details.product',
          'order_details.color',
          'order_details.size',
        ],
      });

      await this.sendOrderConfirmationEmail(populatedOrder);
      console.log('Email xác nhận đơn hàng đã được gửi');

      return order;
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async deleteOne(userId: string, orderId: string): Promise<DeleteResult> {
    const user = await this.userRepos.findOneBy({ user_id: userId });
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    try {
      return await this.orderRepos.delete(orderId);
    } catch (err) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
