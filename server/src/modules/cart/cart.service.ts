import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { Cart } from '../../entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepos: CartRepository
    // private readonly jwtService: JwtService
  ) {}

  async getCartByIdService(userId: string): Promise<Cart> {
    return this.cartRepos.findCartByUserId(userId);
  }

  async addToCartService(
    userId: string,
    productId: string,
    colorSizeId: string,
    sizeId: string,
    quantity: number
  ): Promise<Cart[]> {
    return await this.cartRepos.addToCart(
      userId,
      productId,
      colorSizeId,
      sizeId,
      quantity
    );
  }
}
