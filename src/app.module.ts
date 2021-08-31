import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { AuthModule } from './auth/auth.module';
import { GiftModule } from './gift/gift.module';
import { MailModule } from './mail/mail.module';
import { OngModule } from './ong/ong.module';
import { PartnerModule } from './partner/partner.module';
import { PetModule } from './pet/pet.module';
import { RoleModule } from './role/role.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { SchedulingTypesModule } from './schedulingTypes/schedulingTypes.module';
import { SolicitationModule } from './solicitation/solicitation.module';
import { SolicitationTypesModule } from './solicitationTypes/solicitationTypes.module';
import { SpeciesModule } from './species/species.module';
import { UploadService } from './upload.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    process.env.NODE_ENV === 'dev'
      ? SequelizeModule.forRoot({
        dialect: 'mysql',
        port: Number(process.env.DB_PORT),
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        autoLoadModels: true,
        synchronize: true,
      }) : SequelizeModule.forRoot({
        dialect: 'postgres',
        port: Number(process.env.DB_PORT),
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        autoLoadModels: true,
        synchronize: true,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        protocol: 'postgres'
      }),
    SeederModule.forRoot({
      runOnlyIfTableIsEmpty: true,
    }),
    SendGridModule.forRoot({
      apiKey: process.env.MAIL_KEY
    }),
    RoleModule,
    SpeciesModule,
    SolicitationTypesModule,
    SchedulingTypesModule,
    UserModule,
    AuthModule,
    OngModule,
    PartnerModule,
    GiftModule,
    SolicitationModule,
    PetModule,
    MailModule,
    SchedulingModule,
  ],
  controllers: [],
  providers: [UploadService],
})
export class AppModule { }
