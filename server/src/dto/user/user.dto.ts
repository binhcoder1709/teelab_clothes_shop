import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  user_name: string;
}
