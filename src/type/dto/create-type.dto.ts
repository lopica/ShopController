import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';
import { ShippingAddress } from 'src/user/entities/shipping-address.entity';

export class CreateTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Type(() => Types.ObjectId) 
  role: Types.ObjectId;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Type(() => ShippingAddress) 
  shippingAddress?: ShippingAddress[];

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
