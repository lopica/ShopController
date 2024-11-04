import { IsNotEmpty, IsNumber, IsMongoId, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';

export class CreateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cartItem: any;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
