// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho se necessário

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SEGREDO_MUITO_FORTE_PARA_PRODUCAO', // A MESMA chave secreta do auth.module.ts
    });
  }

  async validate(payload: { sub: string; email: string; lojaId: string }) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    // AQUI ESTÁ A CORREÇÃO:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senhaHash, ...usuarioFormatado } = usuario;

    // Retorna o usuário formatado (sem a senha)
    return usuarioFormatado;
  }
}
