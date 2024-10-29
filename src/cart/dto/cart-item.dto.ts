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

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number; // Price per product
}
