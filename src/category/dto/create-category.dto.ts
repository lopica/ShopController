import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class CreateCategoryDto {
  @IsString() 
  @Length(2, 50)
  name: string;

  @IsOptional() 
  @IsBoolean()
  status?: boolean;
}
