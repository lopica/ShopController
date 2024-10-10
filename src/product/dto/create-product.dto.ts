import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { Size } from 'src/schemas/product.schema';

class ColorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean({
    message: 'Trạng thái màu còn hàng phải ở dạng boolean',
  })
  status: boolean;
}

// Define a class for the size object
class SizeDto {
  @ApiProperty({ enum: Size })
  @IsEnum(Size, {
    message:
      'Mã size của sản phẩm chỉ có thể có các lựa chọn sau: S, M, L, X, XL, 2XL',
  }) // Validate that size is one of the enum values
  name: Size; // Assuming Size is an enum

  @ApiProperty()
  @IsBoolean({
    message: 'Trạng thái mã size còn hàng phải ở dạng boolean',
  })
  status: boolean;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString({
    message: 'Tên sản phẩm phải ở dạng string',
  })
  @Length(2, 30, {
    message: 'Tên danh mục chỉ được dài từ 2 đến 30 ký tự',
  })
  name: string;

  @ApiProperty()
  @IsString({
    message: 'Tên hiển thị sản phẩm phải ở dạng string',
  })
  @Length(2, 30, {
    message: 'Tên hiển thị sản phẩm chỉ được dài từ 2 đến 30 ký tự',
  })
  title: string;

  @ApiProperty()
  @IsString({
    message: 'Miêu tả sản phẩm phải ở dạng string',
  })
  @Length(10, 120, {
    message: 'Miêu tả sản phẩm chỉ được dài từ 10 đến 120 ký tự',
  })
  description: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message: 'Giá sản phẩm phải là số nguyên',
    },
  )
  price: number;

  @ApiProperty()
  @Transform(({ value }) => {
    try {
      return value.split(','); // Parse the JSON string into an array of SizeDto
    } catch (e) {
      return []; // Return an empty array if parsing fails
    }
  })
  @IsArray()
  @IsMongoId({
    each: true,
    message: 'ID danh mục phải đúng format của id mongodb',
  })
  category_id: string[];

  @ApiProperty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new HttpException(
          'Màu sắc sản phẩm phải là một mảng JSON hợp lệ',
          HttpStatus.BAD_REQUEST,
        ); // Custom error if parsing fails
      }
    }
    return value;
  })
  @IsArray({
    message: 'Màu sắc sản phẩm phải lưu dưới dạng array',
  })
  @Type(() => ColorDto) // Transform plain objects into ColorDto instances
  @ValidateNested({ each: true }) // Validate each color object
  colors: ColorDto[];

  @ApiProperty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new HttpException(
          'Kích cỡ sản phẩm phải là một mảng JSON hợp lệ',
          HttpStatus.BAD_REQUEST,
        ); // Custom error if parsing fails
      }
    }
    return value;
  })
  @IsArray()
  @Type(() => SizeDto) // Transform plain objects into SizeDto instances
  @ValidateNested({ each: true }) // Validate each size object
  sizes: SizeDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Transform string to number
  discount?: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Transform string to number
  rating?: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Transform string to number
  stock?: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) // Transform string to boolean
  status?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return value.split(','); // Parse the JSON string into an array of SizeDto
    } catch (e) {
      return []; // Return an empty array if parsing fails
    }
  })
  @IsArray()
  @IsMongoId({ each: true })
  events?: string[] = [];

  @ApiPropertyOptional({ description: 'Thumbnail URL' })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiPropertyOptional({ description: 'Array of image URLs' })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}
