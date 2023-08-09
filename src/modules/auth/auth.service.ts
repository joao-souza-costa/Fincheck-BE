import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn';
import { SignUpDto } from './dto/signUp';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.userRepo.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateJWT(user.id);

    return { token };
  }

  async signUp({ email, password, name }: SignUpDto) {
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

    const token = await this.generateJWT(user.id);

    return { token };
  }

  private async generateJWT(userId: string) {
    const token = await this.jwtService.signAsync({ sub: userId });
    return token;
  }
}
