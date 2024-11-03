import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsMongoId,
  IsEnum,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
  IsUrl,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class StockDetailDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @Transform(({ value }) => Number(value)) // Convert to number
  @IsNumber()
  @Min(0)
  quantity: number;
}

class StockDto {
  @IsString()
  @IsNotEmpty()
  colorCode: string;

  @ValidateNested({ each: true })
  @Type(() => StockDetailDto)
  @ArrayMinSize(1)
  details: StockDetailDto[];
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @Transform(({ value }) => Number(value)) // Convert to number
  @IsNumber()
  @Min(0)
  price: number;

  @Transform(({ value }) => Number(value)) // Convert to number
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number = 0;

  @Transform(({ value }) => Number(value)) // Convert to number
  @IsNumber()
  @Min(0)
  rating: number = 0;

  @Transform(({ value }) => Number(value)) // Convert to number
  @IsNumber()
  @Min(0)
  stock: number = 0;

  @IsMongoId()
  @IsNotEmpty()
  type: string;

  @IsMongoId()
  @IsNotEmpty()
  tag: string;

  @IsMongoId()
  @IsNotEmpty()
  brand: string;

  @IsEnum(['InActive', 'In Stock', 'Sold Out'])
  availabilityStatus: 'InActive' | 'In Stock' | 'Sold Out';

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  reviews: string[];

  @IsString()
  @IsNotEmpty()
  returnPolicy: string = "30 days return policy";

  @Transform(({ value }) => Number(value)) // Convert to number
  @IsNumber()
  @Min(1)
  minimumOrderQuantity: number = 1;

  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  images: string[];

  @IsUrl()
  thumbnail: string;

  @ValidateNested({ each: true })
  @Type(() => StockDto)
  @ArrayMinSize(1)
  stockDetails: StockDto[];
}
