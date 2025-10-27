// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LojaModule } from '../loja/loja.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard'; // <-- 1. IMPORTE O NOVO GUARDA

@Module({
  imports: [
    PrismaModule,
    LojaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: 'SEGREDO_MUITO_FORTE_PARA_PRODUCAO',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  // 2. ADICIONE O JwtAuthGuard AQUI
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
