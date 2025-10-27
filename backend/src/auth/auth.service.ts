// src/auth/auth.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LojaService } from '../loja/loja.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Injetamos todos os serviços que este módulo precisa
  constructor(
    private prisma: PrismaService,
    private lojaService: LojaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra um novo Usuário e uma nova Loja no sistema.
   * Cria ambos em uma transação para garantir a integridade dos dados.
   */
  async register(dto: RegisterDto) {
    // 1. Verificar se o e-mail já está em uso
    const emailEmUso = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (emailEmUso) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    // 2. Verificar se o subdomínio já está em uso
    const subdominioEmUso = await this.prisma.loja.findUnique({
      where: { subdominio: dto.subdominio },
    });
    if (subdominioEmUso) {
      throw new ConflictException('Este subdomínio já está em uso.');
    }

    // 3. Criptografar a senha do usuário
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(dto.senha, salt);

    // 4. Criar a Loja e o Usuário (em uma única transação)
    try {
      const novaLoja = await this.prisma.loja.create({
        data: {
          nome: dto.nomeDaLoja,
          subdominio: dto.subdominio,
          // Cria o usuário aninhado, já ligando-o a esta nova loja
          usuarios: {
            create: {
              email: dto.email,
              senhaHash: senhaHash,
            },
          },
        },
        // Pede ao Prisma para incluir os usuários criados na resposta
        include: {
          usuarios: true,
        },
      });

      // 5. Formatar a resposta para o cliente (removendo a senha)
      const { usuarios, ...loja } = novaLoja;

      // Usamos desestruturação para remover a senhaHash do objeto
      // antes de enviá-lo de volta ao cliente.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senhaHash: _, ...usuarioFormatado } = usuarios[0];

      return {
        mensagem: 'Usuário registrado com sucesso!',
        loja: loja,
        usuario: usuarioFormatado,
      };
    } catch (error) {
      // Captura qualquer erro que possa ocorrer durante a transação
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Erro ao criar registro: ${error.message}`);
    }
  }

  /**
   * Autentica um usuário e retorna um Token de Acesso (JWT).
   */
  async login(dto: LoginDto) {
    // 1. Encontre o usuário pelo e-mail
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    // 2. Se o usuário não existir, dispare um erro de "não autorizado"
    // Usamos a mesma mensagem de erro para senha/email errados por segurança.
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // 3. Compare a senha enviada (dto.senha) com a senha criptografada (usuario.senhaHash)
    const senhasBatem = await bcrypt.compare(dto.senha, usuario.senhaHash);

    // 4. Se as senhas não baterem, dispare o erro
    if (!senhasBatem) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // 5. Se chegou até aqui, o usuário está autenticado!
    // Vamos gerar o Token JWT.

    const payload = {
      sub: usuario.id, // "Subject" (o ID do usuário)
      email: usuario.email,
      lojaId: usuario.lojaId, // Essencial para saber de qual loja ele é
    };

    // 6. Assina o token com o segredo definido no auth.module.ts
    const tokenDeAcesso = await this.jwtService.signAsync(payload);

    // 7. Retorne o token para o cliente
    return {
      message: 'Login bem-sucedido!',
      access_token: tokenDeAcesso,
    };
  }
}
