import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ColorSize } from './colorSize.entity';
import { Product } from './product.entity';
import { Size } from './size.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  cart_item_id: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  cart: Cart;

  @ManyToOne(() => ColorSize, { eager: true })
  @JoinColumn()
  colorSize: ColorSize;

  @ManyToOne(() => Size, { eager: true })
  @JoinColumn()
  size: Size;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn()
  product: Product;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  added_at: Date;
}
