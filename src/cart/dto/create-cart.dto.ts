import { IsNotEmpty, IsNumber, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';

export class CreateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cartItem: CartItemDto[];

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
