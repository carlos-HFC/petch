import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { AuthModule } from './auth/auth.module';
import { MediaModule } from './medias/media.module';
import { RoleModule } from './role/role.module';
import { SchedulingTypesModule } from './schedulingTypes/schedulingTypes.module';
import { SolicitationTypesModule } from './solicitationTypes/solicitationTypes.module';
import { SpeciesModule } from './species/species.module';
import { UploadService } from './upload.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev']
    }),
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
    RoleModule,
    SpeciesModule,
    SolicitationTypesModule,
    SchedulingTypesModule,
    UserModule,
    AuthModule,
    MediaModule
  ],
  controllers: [],
  providers: [UploadService],
})
export class AppModule { }
