import { Module } from '@nestjs/common';
import { OrmModule } from 'src/configs/typeorm/orm.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { CartController } from './cart.controller';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cartItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ColorSize } from 'src/entities/colorSize.entity';
import { Size } from 'src/entities/size.entity';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    OrmModule,
    JwtModule.register({
      secret: process.env.ACCESS_SECRET_KEY,
    }),
    UserModule,
    // TypeOrmModule.forFeature([Cart, CartItem, Product, ColorSize, Size]),
    ProductModule,
  ],
  providers: [CartService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
