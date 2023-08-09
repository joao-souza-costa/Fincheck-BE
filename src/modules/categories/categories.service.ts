import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from 'src/shared/database/repositories/categories.repositories';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepo: CategoryRepository) {}
  findAllByUserId(userId: string) {
    return this.categoryRepo.findAll({
      where: { userId },
    });
  }
}
