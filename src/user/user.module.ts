import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';
import { MediaModule } from '../medias/media.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET
    }),
    RoleModule,
    MediaModule
    // SeederModule.forFeature
    // ConfigModule.forRoot({})
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }