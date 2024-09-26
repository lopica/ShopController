import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Quần áo nam',
    minLength: 2,
    maxLength: 15,
  })
  @IsString() 
  @Length(2, 50)
  name: string;

  @ApiPropertyOptional({
    description: 'The status of the category',
    example: false,
    default: false,
  })
  @IsOptional() 
  @IsBoolean()
  status?: boolean;
}
