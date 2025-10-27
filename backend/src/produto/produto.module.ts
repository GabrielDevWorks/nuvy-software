// src/produto/produto.module.ts
import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- IMPORTE AQUI

@Module({
  imports: [PrismaModule], // <-- ADICIONE AQUI
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}
