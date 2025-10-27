// src/produto/produto.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateProdutoDto } from './dto/create-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova categoria para a loja do usuário logado.
   */
  criarCategoria(dto: CreateCategoriaDto, lojaId: string) {
    // A 'lojaId' vem do nosso token (vamos configurar no controller)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.categoria.create({
      data: {
        nome: dto.nome,
        lojaId: lojaId, // Garante que a categoria seja ligada à loja certa
      },
    });
  }

  /**
   * Cria um novo produto para a loja do usuário logado.
   */
  async criarProduto(dto: CreateProdutoDto, lojaId: string) {
    // 1. Verificar se a categoria informada pertence à loja do usuário
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: dto.categoriaId },
    });

    // Se a categoria não existe OU não pertence à loja do usuário, bloqueie.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!categoria || categoria.lojaId !== lojaId) {
      throw new ForbiddenException(
        'Você não tem permissão para usar esta categoria.',
      );
    }

    // 2. Se tudo estiver ok, crie o produto
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.produto.create({
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
        preco: dto.preco,
        imagemUrl: dto.imagemUrl,
        lojaId: lojaId, // Liga o produto à loja
        categoriaId: dto.categoriaId, // Liga o produto à categoria verificada
      },
    });
  }
}
