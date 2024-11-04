import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsMongoId } from 'class-validator';

export class CartItemDto {
  @IsNotEmpty()
  @IsString()
  productTitle: string;

  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  price: number; // Price per product
}
