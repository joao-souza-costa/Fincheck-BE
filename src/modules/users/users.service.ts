import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { hash } from 'bcryptjs';
import { UsersRepository } from 'src/shared/database/respositories/users.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const checkEmail = await this.userRepo.findUnique({
      where: { email: email },
      select: { id: true },
    });

    const passHashed = await hash(password, 10);

    if (checkEmail) throw new ConflictException('This email already in use');

    const user = await this.userRepo.create({
      data: {
        email,
        name,
        password: passHashed,
        categories: {
          createMany: {
            data: [
              { name: 'Salário', icon: 'travel', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              // Expense
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
              { name: 'Mercado', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Roupas', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
              { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
            ],
          },
        },
      },
    });

    return {
      email: user.email,
      name: user.name,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
