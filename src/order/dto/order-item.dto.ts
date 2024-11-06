import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class OrderItemDto {
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsString()
  productTitle: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

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
