import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from 'src/shared/database/repositories/categories.repositories';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryHelper } from 'src/shared/helpers/categories/categories.helpers';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly categoryHelper: CategoryHelper,
  ) {}

  findAllByUserId(userId: string) {
    return this.categoryRepo.findAll({
      where: { userId },
    });
  }

  async create(userId: string, { icon, name, type }: CreateCategoryDto) {
    return this.categoryRepo.create({
      data: {
        icon,
        name,
        type,
        userId,
      },
    });
  }

  async update(
    userId: string,
    id: string,
    { icon, name, type }: UpdateCategoryDto,
  ) {
    await this.categoryHelper.validateOwner(userId, id);

    return this.categoryRepo.update({
      where: {
        id: id,
      },
      data: {
        icon,
        name,
        type,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.categoryHelper.validateOwner(userId, id);
    return this.categoryRepo.delete({
      where: {
        id: id,
      },
    });
  }
}
