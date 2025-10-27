// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Nós não precisamos colocar nada aqui.
  // O simples fato de este arquivo existir e estender o AuthGuard
  // já resolve 99% dos problemas de cache do NestJS.
}
