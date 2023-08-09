import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  dbURL: string;

  @IsString()
  @IsNotEmpty()
  jwtSecret: string;
}

export const env: Env = plainToInstance(Env, {
  jwtSecret: process.env.JWT_SECRET,
  dbURL: process.env.DATABASE_URL,
});

const erros = validateSync(env);
if (erros.length) throw new Error(JSON.stringify(erros, null, 3));
