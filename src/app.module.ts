import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { diskStorage } from 'multer';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { join, resolve } from 'path';

import { RoleModule } from './role/role.module';
import { SchedulingTypesModule } from './schedulingTypes/schedulingTypes.module';
import { SolicitationTypesModule } from './solicitationTypes/solicitationTypes.module';
import { SpeciesModule } from './species/species.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev']
    }),
    MulterModule.register({
      dest: resolve(__dirname, '..', 'uploads'),
      storage: diskStorage({
        filename(req, file, cb) {
          const filename = `${Date.now()}__${file.originalname}`;

          cb(null, filename);
        }
      })
    }),
    SequelizeModule.forRoot({
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    RoleModule,
    SpeciesModule,
    SolicitationTypesModule,
    SchedulingTypesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
