// src/produto/dto/create-categoria.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório.' })
  nome: string;
}
