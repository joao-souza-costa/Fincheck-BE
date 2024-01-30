import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { add } from 'date-fns';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn';
import { SignUpDto } from './dto/signUp';
import { SendResetPasswordEmailDto } from './dto/sendResetPasswordEmail';
import { ResetPasswordTokenRepository } from 'src/shared/database/repositories/reset-password-token.repositories';
import { ResetPasswordDto } from './dto/resetPasswordDto';
import { MailerService } from '@nestjs-modules/mailer';
import recoveryEmail from 'src/email/recorveryPassword/';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly resetPasswordTokenRepo: ResetPasswordTokenRepository,
    private readonly mailerService: MailerService,
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
        email: email.toLowerCase(),
        name,
        password: passHashed,
        categories: {
          createMany: {
            data: [
              //Income
              { name: 'Salário', icon: 'income', type: 'INCOME' },
              { name: 'Serviços', icon: 'travel', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              // Expense
              { name: 'Salão', icon: 'salon', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
            ],
          },
        },
      },
    });

    const token = await this.generateJWT(user.id);

    return { token };
  }

  async sendResetPasswordEmail({ email }: SendResetPasswordEmailDto) {
    const user = await this.userRepo.findUnique({
      where: { email: email },
      select: { id: true, name: true, email: true },
    });

    if (!user) throw new NotFoundException('User not found');

    let token = await this.resetPasswordTokenRepo.findUnique({
      where: { userId: user.id },
      select: { expired_date: true, id: true },
    });

    if (!token) {
      token = await this.resetPasswordTokenRepo.create({
        data: {
          userId: user.id,
          expired_date: add(Date.now(), { days: 4 }),
        },
      });
    }

    const isExpiredToken = new Date() > token.expired_date;

    if (token && isExpiredToken) {
      await this.resetPasswordTokenRepo.update({
        where: {
          id: token.id,
        },
        data: {
          expired_date: add(Date.now(), { days: 4 }),
        },
      });
    }

    await this.mailerService.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Email para a recuperação de senha',
      html: recoveryEmail(user.name, token.id),
    });
  }

  async resetPassword({ password }: ResetPasswordDto, currentToken: string) {
    const token = await this.resetPasswordTokenRepo.findUnique({
      where: { id: currentToken },
      select: { expired_date: true, userId: true },
    });

    if (!token) throw new NotFoundException('Token not found');

    const isExpiredToken = new Date() > token.expired_date;

    if (isExpiredToken) throw new UnauthorizedException('Token expired');

    const passHashed = await hash(password, 10);

    await this.userRepo.update({
      where: { id: token.userId },
      data: {
        password: passHashed,
        resetPasswordTokens: {
          delete: {
            id: token.id,
            userId: token.userId,
          },
        },
      },
    });

    return { message: 'Password change with success' };
  }

  private async generateJWT(userId: string) {
    const token = await this.jwtService.signAsync({ sub: userId });
    return token;
  }
}
