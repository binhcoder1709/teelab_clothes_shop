import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/entities/product.entity';
import { ProductDto } from 'src/dto/product/product.dto';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(200)
  async getAllProductsController(
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<Product[]> {
    return await this.productService.getAllProductsService(page, limit);
  }

  @Get('/search')
  @HttpCode(200)
  async searchProductController(@Query('q') query: string) {
    return await this.productService.searchProductService(query);
  }

  @Get('/:id')
  @HttpCode(200)
  async GetOneController(@Param() id: any): Promise<Product> {
    return await this.productService.getOneService(id.id);
  }

  @Delete('delete/:id')
  @HttpCode(200)
  async DeleteController(@Param() id: any): Promise<boolean> {
    return await this.productService.deleteService(id.id);
  }

  @Post('/create')
  @HttpCode(201)
  async addProductController(@Body() productDto: ProductDto) {
    return await this.productService.createProductService(productDto);
  }

  @Put('/update/:id')
  @HttpCode(200)
  async updateProductController(
    @Body() data: any,
    @Param() id: any
  ): Promise<any> {
    return await this.productService.updateProductService(id.id, data);
  }
}
