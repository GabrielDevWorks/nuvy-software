// src/produto/dto/create-produto.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  nome: string;

  @IsString()
  @IsOptional() // Opcional
  descricao?: string;

  @IsNumber()
  preco: number; // Ex: 29.99

  @IsString()
  @IsUrl({}, { message: 'Por favor, insira uma URL de imagem válida.' })
  @IsOptional() // Opcional
  imagemUrl?: string;

  @IsUUID(4, { message: 'O ID da categoria é inválido.' })
  categoriaId: string;
}
