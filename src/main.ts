import { HttpException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { DislikeModule } from './dislike/dislike.module';
import { FavoriteModule } from './favorite/favorite.module';
import { GiftModule } from './gift/gift.module';
import { OngModule } from './ong/ong.module';
import { PartnerModule } from './partner/partner.module';
import { PetModule } from './pet/pet.module';
import { RoleModule } from './role/role.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { SchedulingTypesModule } from './schedulingTypes/schedulingTypes.module';
import { SolicitationModule } from './solicitation/solicitation.module';
import { SolicitationTypesModule } from './solicitationTypes/solicitationTypes.module';
import { SpeciesModule } from './species/species.module';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Petch')
    .setDescription('Swagger do Petch')
    .setVersion('1.0.0')
    .addServer(process.env.NODE_ENV === 'dev' ? 'http://localhost:8000' : 'https://petch-dev.herokuapp.com')
    .addBearerAuth({ type: 'http', in: 'header' })
    .addTag('Auth', 'Login dos usuários, registro de novos adotantes, reinicialização de senha')
    .addTag('Dislikes', 'Dislikes que os adotantes dão nos pets listados')
    .addTag('Favorites', 'Pets favoritos salvos pelos adotantes')
    .addTag('Gifts', 'Brindes que o adotante escolherá ao adotar um pet')
    .addTag('ONGs', 'ONGs das quais os pets pertencem')
    .addTag('Partners', 'Empresas parceiras da plataforma')
    .addTag('Pets', 'Pets pertencentes das ONGs que estarão disponíveis para adoção')
    .addTag('Roles', 'Funções que os usuários terão dentro da plataforma')
    .addTag('Schedulings', 'Agendamentos marcados pelos adotantes')
    .addTag('Scheduling Types', 'Tipos de agendamento que o adotante pode efetuar')
    .addTag('Solicitations', 'Solicitações que os adotantes enviarem')
    .addTag('Solicitation Types', 'Tipos de solicitação que os adotantes podem abrir')
    .addTag('Species', 'Espécies de animais que serão colocados para adoação')
    .addTag('Users', 'Usuários cadastrados na plataforma')
    .build();
  const docs = SwaggerModule.createDocument(app, options, {
    include: [AuthModule, DislikeModule, FavoriteModule, GiftModule, OngModule, PartnerModule, PetModule, RoleModule, SchedulingModule, SchedulingTypesModule, SolicitationModule, SolicitationTypesModule, SpeciesModule, UserModule],
  });
  SwaggerModule.setup('swagger', app, docs);
  const whitelist = ['https://petch-front.herokuapp.com', 'http://petch-front.herokuapp.com', 'http://localhost:3000'];
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        cb(null, true);
      } else {
        cb(new HttpException('Erro de cors', 500), false);
      }
    }
  });
  app.useGlobalFilters(new AllExceptionsFilter(app.getHttpAdapter()));
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
