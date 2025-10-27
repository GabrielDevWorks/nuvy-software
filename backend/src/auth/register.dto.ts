// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;

  @IsString({ message: 'O nome da loja deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da loja não pode estar vazio.' })
  nomeDaLoja: string;

  @IsString({ message: 'O subdomínio deve ser uma string.' })
  @IsNotEmpty({ message: 'O subdomínio não pode estar vazio.' })
  subdominio: string;
}
