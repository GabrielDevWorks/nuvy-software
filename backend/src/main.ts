// src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // <-- Importe isso
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 Adicione esta linha para habilitar validação automática
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Remove propriedades não definidas no DTO
    forbidNonWhitelisted: true, // Retorna erro se houver propriedades extras
    transform: true,           // Converte tipos automaticamente (ex: string -> number)
    stopAtFirstError: true,    // Para na primeira falha (opcional)
  }));

  await app.listen(3000);
}
bootstrap();