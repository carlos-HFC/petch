import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { UserController } from './user.controller';
import { User } from './user.model';
import { UserSeed } from './user.seed';
import { UserService } from './user.service';
import { MailModule } from '../mail/mail.module';
import { RoleModule } from '../role/role.module';
import { UploadService } from '../upload.service';

@Module({
  imports: [
    SeederModule.forFeature([UserSeed]),
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET
    }),
    RoleModule,
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, UploadService],
  exports: [UserService],
})
export class UserModule { }