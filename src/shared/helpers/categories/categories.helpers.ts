import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'src/shared/database/repositories/categories.repositories';

@Injectable()
export class CategoryHelper {
  constructor(private readonly categoriesRepo: CategoryRepository) {}

  async validateOwner(userId: string, id: string) {
    const isOwner = await this.categoriesRepo.findFirst({
      where: { id, userId },
    });

    if (!isOwner) throw new NotFoundException('Category not found.');
  }
}
