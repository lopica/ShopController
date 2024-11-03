import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  status: boolean = false;
}
