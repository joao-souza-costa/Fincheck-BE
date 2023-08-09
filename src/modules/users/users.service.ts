import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  findUserById(userId: string) {
    return this.userRepo.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
