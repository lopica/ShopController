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
  import { Type } from 'class-transformer';
  
  class StockDetailDto {
    @IsString()
    @IsNotEmpty()
    size: string;
  
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
  
    @IsNumber()
    @Min(0)
    price: number;
  
    @IsNumber()
    @Min(0)
    @Max(100)
    discountPercentage: number;
  
    @IsNumber()
    @Min(0)
    rating: number;
  
    @IsNumber()
    @Min(0)
    stock: number;
  
    @IsMongoId()
    @IsNotEmpty()
    type: string;
  
    @IsMongoId()
    @IsNotEmpty()
    tag: string;
  
    @IsMongoId()
    @IsNotEmpty()
    brand: string;
  
    @IsEnum(['Active', 'InActive'])
    availabilityStatus: 'Active' | 'InActive';
  
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    reviews: string[];
  
    @IsString()
    @IsNotEmpty()
    returnPolicy: string;
  
    @IsNumber()
    @Min(1)
    minimumOrderQuantity: number;
  
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
  