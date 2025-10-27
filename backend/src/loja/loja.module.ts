import { Module } from '@nestjs/common';
import { LojaService } from './loja.service';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Caminho ajustado

@Module({
  imports: [PrismaModule],
  providers: [LojaService],
  exports: [LojaService],
})
export class LojaModule {}
