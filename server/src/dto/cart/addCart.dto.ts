import { IsNumber, IsString } from 'class-validator';

export class AddCartDto {
  @IsString()
  product_id: string;

  @IsString()
  color_size_id: string;

  @IsString()
  size_id: string;

  @IsNumber()
  quantity: number;
}
