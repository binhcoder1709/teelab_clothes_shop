import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';
import { Cart } from 'src/entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorSize } from 'src/entities/colorSize.entity';
import { CartItem } from 'src/entities/cartItem.entity';
import { Size } from 'src/entities/size.entity';

@Injectable()
export class CartRepository {
  private productRepository: Repository<Product>;
  private cartRepository: Repository<Cart>;
  private cartItemRepository: Repository<CartItem>;
  private colorSizeRepository: Repository<ColorSize>;
  private sizeRepository: Repository<Size>;

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource
    // @InjectRepository(Product)
    // private readonly productRepository: Repository<Product>,
    // @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    // @InjectRepository(CartItem)
    // private readonly cartItemRepository: Repository<CartItem>,
    // @InjectRepository(ColorSize)
    // private readonly colorSizeRepository: Repository<ColorSize>,
    // @InjectRepository(Size) private readonly sizeRepository: Repository<Size>
  ) {
    this.productRepository = dataSource.getRepository(Product);
    this.cartRepository = dataSource.getRepository(Cart);
    this.cartItemRepository = dataSource.getRepository(CartItem);
    this.colorSizeRepository = dataSource.getRepository(ColorSize);
    this.sizeRepository = dataSource.getRepository(Size);
  }

  async findCartByUserId(userId: string): Promise<Cart> {
    // Tìm giỏ hàng của người dùng
    const cart = await this.cartRepository.findOne({
      where: { user: { user_id: userId } },
      relations: [
        'cartItems',
        'cartItems.product',
        'cartItems.colorSize',
        'cartItems.size',
      ],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for the given user');
    }

    return cart;
  }

  async addToCart(
    userId: string,
    productId: string,
    colorSizeId: string,
    sizeId: string,
    quantity: number
  ): Promise<any> {
    // Tìm giỏ hàng của người dùng
    let cart = await this.cartRepository.findOne({
      where: { user: { user_id: userId } },
      relations: ['cartItems'],
    });
    if (!cart) {
      // Nếu người dùng chưa có giỏ hàng, tạo giỏ hàng mới
      cart = this.cartRepository.create({
        user: { user_id: userId },
        cartItems: [],
      });
      await this.cartRepository.save(cart);
    }

    // Tìm sản phẩm
    const product = await this.productRepository.findOne({
      where: { product_id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Tìm ColorSize
    const colorSize = await this.colorSizeRepository.findOne({
      where: { color_size_id: colorSizeId },
      relations: ['sizes'],
    });
    if (!colorSize) {
      throw new NotFoundException('Color and Size combination not found');
    }

    // Tìm kích thước
    const size = await this.sizeRepository.findOne({
      where: { size_id: sizeId },
    });
    if (!size || !colorSize.sizes.some((s) => s.size_id === sizeId)) {
      throw new NotFoundException('Size not found in the selected ColorSize');
    }

    // Kiểm tra xem sản phẩm với ColorSize và Size này đã có trong giỏ hàng chưa
    let cartItem = cart.cartItems.find(
      (item) =>
        item.product.product_id === productId &&
        item.colorSize.color_size_id === colorSizeId &&
        item.size.size_id === sizeId
    );

    if (cartItem) {
      // Nếu đã có, cập nhật số lượng
      cartItem.quantity += quantity;
    } else {
      // Nếu chưa có, tạo mới CartItem
      cartItem = this.cartItemRepository.create({
        cart: cart,
        product: product,
        colorSize: colorSize,
        size: size,
        quantity: quantity,
      });
      cart.cartItems.push(cartItem);
    }

    // Lưu thay đổi
    await this.cartItemRepository.save(cartItem);
    await this.cartRepository.save(cart);

    return cartItem;
  }
}
