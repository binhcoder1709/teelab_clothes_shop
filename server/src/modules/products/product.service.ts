import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from 'src/entities/product.entity';
import { ProductDto } from 'src/dto/product/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepos: ProductRepository) {}

  async getAllProductsService(page: number, limit: number): Promise<Product[]> {
    return await this.productRepos.findAll(page, limit);
  }

  async createProductService(productDto: ProductDto) {
    return this.productRepos.createOne(productDto);
  }
  async searchProductService(query: string) {
    return await this.productRepos.search(query);
  }

  async getOneService(id: string): Promise<Product> {
    return await this.productRepos.findById(id);
  }
  async deleteService(id: string): Promise<boolean> {
    return !!(await this.productRepos.findByIdAndDelete(id));
  }
  async updateProductService(id: string, data: any): Promise<Product> {
    return await this.productRepos.updateProductRepo(id, data);
  }
}
