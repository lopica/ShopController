import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({
    description: 'The name of the category',
    example: 'Quần áo nam',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'The status of the category',
    example: true,
  })
  status?: boolean;
}
