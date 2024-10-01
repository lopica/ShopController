import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  description: string;

  @IsMongoId()
  @IsDefined()
  category_id: ObjectId;

  @IsNumber()
  @Min(0)
  @Max(1)
  discount: number; // Validation added for range

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number; // Rating should be between 0 and 5

  @IsNumber()
  @Min(0)
  stock: number; // Ensure stock cannot be negative

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsMongoId()
  @IsOptional()
  event_id?: ObjectId;
}
