import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryTypes } from '../entities/Create';
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsEnum(CategoryTypes)
  type: CategoryTypes;
}
