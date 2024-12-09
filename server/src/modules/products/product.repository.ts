import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductDto } from 'src/dto/product/product.dto';
import { Category } from 'src/entities/category.entity';
import { Color } from 'src/entities/color.entity';
import { ColorSize } from 'src/entities/colorSize.entity';
import { Product } from 'src/entities/product.entity';
import { Size } from 'src/entities/size.entity';
import { DataSource, DeleteResult, Like, Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  private productRepos: Repository<Product>;
  private colorRepos: Repository<Color>;
  private sizeRepos: Repository<Size>;
  private colorSizeRepos: Repository<ColorSize>;
  private categoryRepos: Repository<Category>;

  constructor(@Inject('DATA_SOURCE') private dataSource: DataSource) {
    this.productRepos = dataSource.getRepository(Product);
    this.colorRepos = dataSource.getRepository(Color);
    this.sizeRepos = dataSource.getRepository(Size);
    this.colorSizeRepos = dataSource.getRepository(ColorSize);
    this.categoryRepos = dataSource.getRepository(Category);
  }

  async search(query: string): Promise<Product[]> {
    console.log(query);

    const result = await this.productRepos.find({
      where: {
        product_name: Like(`%${query}%`),
      },
      relations: [
        'colorSizes',
        'colorSizes.colors',
        'colorSizes.sizes',
        'category',
      ],
    });
    console.log(result);

    return result;
  }

  async findByIdAndDelete(id: string): Promise<DeleteResult> {
    try {
      const product = await this.productRepos.findOne({
        where: { product_id: id },
        relations: ['colorSizes', 'colorSizes.colors', 'colorSizes.sizes'],
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      await this.colorSizeRepos.delete({ product: { product_id: id } });

      const result = await this.productRepos.delete(id);
      console.log(result);

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(page: number, limit: number): Promise<Product[]> {
    try {
      let result;

      if (page && limit) {
        const [products, totalItems] = await this.productRepos.findAndCount({
          relations: [
            'colorSizes',
            'colorSizes.colors',
            'colorSizes.sizes',
            'category',
          ],
          take: limit,
          skip: (page - 1) * limit,
          order: {
            product_name: 'ASC',
          },
        });
        const totalPages = Math.ceil(totalItems / limit);
        result = {
          products,
          totalItems,
          totalPages,
          page: page,
          limit: limit,
        };
      } else {
        const products = await this.productRepos.find({
          relations: [
            'colorSizes',
            'colorSizes.colors',
            'colorSizes.sizes',
            'category',
          ],
          order: {
            product_name: 'ASC',
          },
        });
        const totalItems = await this.productRepos.count();
        result = {
          products,
          totalItems,
          totalPages: 1,
          page: 1,
          limit: totalItems,
        };
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findById(id: string): Promise<Product> {
    return await this.productRepos.findOne({
      where: { product_id: id },
      relations: [
        'colorSizes',
        'colorSizes.colors',
        'colorSizes.sizes',
        'category',
      ],
    });
  }

  async createOne(data: any): Promise<Product> {
    try {
      const newProduct = new Product();
      newProduct.product_name = data.product_name;
      newProduct.thumbnail = data.thumbnail;
      newProduct.thumbnail_hover = data.thumbnail_hover;
      newProduct.images = data.images;
      newProduct.discount = data.discount;
      newProduct.description = data.description;
      newProduct.description_image = data.description_image;
      newProduct.price = data.price;
      newProduct.status = data.status;

      // Tìm category
      const category = await this.categoryRepos.findOne({
        where: { category_id: data.category },
      });
      if (category) {
        newProduct.category = category;
      } else {
        throw new NotFoundException('Category not found');
      }

      //lưu sản phẩm
      const savedProduct = await this.productRepos.save(newProduct);

      // lặp qua các option
      for (const option of data.option) {
        // Tạo mới màu sắc
        const newColor = new Color();
        newColor.color_name = option.color;
        newColor.image = option.image;

        // Lưu màu sắc vào db
        const savedColor = await this.colorRepos.save(newColor);

        // Tạo ColorSize
        const newColorSize = new ColorSize();
        newColorSize.colors = savedColor;
        newColorSize.product = savedProduct;

        // Lưu ColorSize vào db
        const savedColorSize = await this.colorSizeRepos.save(newColorSize);

        // lặp qua các size của màu
        for (const sizeOption of option.sizes) {
          // Tạo mới
          const newSize = new Size();
          newSize.size_name = sizeOption.size;
          newSize.quantity = sizeOption.quantity;
          newSize.colorSize = savedColorSize;

          // Lưu size vào db
          await this.sizeRepos.save(newSize);
        }
      }

      return savedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async updateProductRepo(id: string, data: any): Promise<any> {
    try {
      // Tìm sản phẩm theo ID
      const product = await this.productRepos.findOne({
        where: { product_id: id },
        relations: [
          'colorSizes',
          'colorSizes.colors',
          'colorSizes.sizes',
          'category',
        ],
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Cập nhật thông tin sản phẩm
      product.product_name = data.product_name || product.product_name;
      product.thumbnail = data.thumbnail || product.thumbnail;
      product.thumbnail_hover = data.thumbnail_hover || product.thumbnail_hover;
      product.images = data.images || product.images;
      product.discount = data.discount || product.discount;
      product.description = data.description || product.description;
      product.description_image =
        data.description_image || product.description_image;
      product.price = data.price || product.price;
      product.status = data.status || product.status;

      // Cập nhật danh mục nếu có thay đổi
      if (
        data.category &&
        data.category.category_id !== product.category.category_id
      ) {
        const category = await this.categoryRepos.findOne({
          where: { category_id: data.category.category_id },
        });
        if (category) {
          product.category = category;
        } else {
          throw new NotFoundException('Category not found');
        }
      }

      // Lưu sản phẩm đã cập nhật
      const updatedProduct = await this.productRepos.save(product);

      // Xóa tất cả các ColorSize hiện có liên quan đến sản phẩm
      await this.colorSizeRepos.delete({ product: { product_id: id } });
      console.log('đến xoá color size');

      // Xử lý màu sắc và kích cỡ
      for (const colorSize of data.colorSizes) {
        // Tìm hoặc tạo mới màu sắc
        let color = await this.colorRepos.findOne({
          where: { color_id: colorSize.colors.color_id },
        });
        if (!color) {
          color = new Color();
          color.color_id = colorSize.colors.color_id;
          color.color_name = colorSize.colors.color_name;
          color.image = colorSize.colors.image;
          color = await this.colorRepos.save(color);
        }
        console.log('đến xoá color');

        // Tạo mới ColorSize
        const newColorSize = new ColorSize();
        newColorSize.color_size_id = colorSize.color_size_id;
        newColorSize.colors = color;
        newColorSize.product = updatedProduct;

        // Lưu ColorSize vào db
        const savedColorSize = await this.colorSizeRepos.save(newColorSize);

        // Xử lý các kích cỡ
        for (const size of colorSize.sizes) {
          // Tìm hoặc tạo mới kích cỡ
          let sizeEntity = await this.sizeRepos.findOne({
            where: {
              size_id: size.size_id,
              colorSize: { color_size_id: savedColorSize.color_size_id },
            },
          });
          if (!sizeEntity) {
            sizeEntity = new Size();
            sizeEntity.size_id = size.size_id;
            sizeEntity.size_name = size.size_name;
            sizeEntity.quantity = size.quantity;
            sizeEntity.colorSize = savedColorSize;
            await this.sizeRepos.save(sizeEntity);
          } else {
            sizeEntity.size_name = size.size_name;
            sizeEntity.quantity = size.quantity;
            await this.sizeRepos.save(sizeEntity);
          }
        }
      }

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
