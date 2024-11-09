import { IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class StockDetailDto {
  @IsString()
  size: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}

export class StockDto {
  @IsString()
  colorCode: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockDetailDto)
  details: StockDetailDto[];
}

export class CreateDepotProductDto {
  @IsString()
  productId: Types.ObjectId;

  @IsNumber()
  importPrice: number;

  @IsNumber()
  stock: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockDto)
  stockDetails: StockDto[];

  @IsNumber()
  importTotal: number;
}
