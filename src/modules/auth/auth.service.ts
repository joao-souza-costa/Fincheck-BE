import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { compare, hash } from 'bcryptjs';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn';
import { SignUpDto } from './dto/signUp';
import { SendResetPasswordEmailDto } from './dto/sendResetPasswordEmail';
import { ResetPasswordDto } from './dto/resetPasswordDto';
import { MailerService } from '@nestjs-modules/mailer';
import recoveryEmail from 'src/email/recorveryPassword/';
import { env } from 'src/shared/config/env';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly jwtService: JwtService,
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

    const token = await this.generateJWT({ sub: user.id });

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

    const token = await this.generateJWT({ sub: user.id });

    return { token };
  }

  async sendResetPasswordEmail({ email }: SendResetPasswordEmailDto) {
    const user = await this.userRepo.findUnique({
      where: { email: email },
      select: { id: true, name: true, email: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const token = await this.generateJWT(
      { sub: user.id, email: user.email },
      { expiresIn: '3h' },
    );

    await this.mailerService.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Email para a recuperação de senha',
      html: recoveryEmail(
        user.name,
        env.frontURL.concat(`/forgot-password/${token.replaceAll('.', '$')}`),
      ),
    });
  }

  async resetPassword({ password }: ResetPasswordDto, currentToken: string) {
    try {
      const token = await this.jwtService.verifyAsync(
        currentToken.replaceAll('$', '.'),
        {
          secret: env.jwtSecret,
        },
      );

      const user = this.userRepo.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      const passHashed = await hash(password, 10);

      await this.userRepo.update({
        where: { id: token.sub },
        data: {
          password: passHashed,
        },
      });

      return { message: 'Password change with success' };
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException({
        codeMessage: 'IVTOKEN',
        message: 'Invalid token',
      });
    }
  }

  private async generateJWT(
    jwtParams: Record<string, string>,
    options?: JwtSignOptions,
  ) {
    const token = await this.jwtService.signAsync(jwtParams, options);
    return token;
  }
}
