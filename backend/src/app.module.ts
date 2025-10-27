import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LojaModule } from './loja/loja.module';
import { PrismaModule } from './prisma/prisma.module'; // <-- IMPORTE AQUI
import { ProdutoModule } from './produto/produto.module';

@Module({
  imports: [AuthModule, LojaModule, PrismaModule, ProdutoModule], // <-- ADICIONE AQUI
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
