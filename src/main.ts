import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { RoleModule } from './role/role.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Petch')
    .setDescription('Swagger do Petch')
    .setVersion('1.0.0')
    .addTag('Roles', 'Armazenará as funções que os usuários terão dentro da plataforma')
    .build();
  const docs = SwaggerModule.createDocument(app, options, {
    include: [RoleModule],
  });
  SwaggerModule.setup('swagger', app, docs);
  app.enableCors();
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
