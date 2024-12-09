import { IsString, IsUrl } from 'class-validator';

export class CreateColorDto {
  @IsString()
  color_name: string;

  @IsUrl()
  image: string[];
}
