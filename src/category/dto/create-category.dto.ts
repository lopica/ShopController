import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Quần áo nam',
    minLength: 2,
    maxLength: 15,
  })
  @IsString({
    message: 'Tên danh mục phải ở dạng string'
  }) 
  @Length(2, 15, {
    message: 'Tên danh mục chỉ được dài từ 2 đến 15 ký tự'
  })
  name: string;

  @ApiPropertyOptional({
    description: 'The status of the category',
    example: false,
    default: false,
  })
  @IsOptional() 
  @IsBoolean({
    message: 'Trạng thái hiện thị của danh mục phải là boolean'
  })
  status?: boolean;
}
