import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  dbURL: string;

  @IsString()
  @IsNotEmpty()
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  gmailEmail: string;

  @IsString()
  @IsNotEmpty()
  gmailPassword: string;

  @IsString()
  @IsNotEmpty()
  gmailUserName: string;

  @IsString()
  @IsNotEmpty()
  frontURL: string;
}

export const env: Env = plainToInstance(Env, {
  jwtSecret: process.env.JWT_SECRET,
  frontURL: process.env.FRONT_URL,
  dbURL: process.env.DATABASE_URL,
  gmailEmail: process.env.GMAIL_EMAIL,
  gmailPassword: process.env.GMAIL_PASSWORD,
  gmailUserName: process.env.GMAIL_USER_NAME,
});

const erros = validateSync(env);
if (erros.length) throw new Error(JSON.stringify(erros, null, 3));
