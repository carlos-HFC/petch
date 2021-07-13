import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PartnerController } from './partner.controller';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';
import { MediaModule } from '../medias/media.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Partner]),
    MediaModule
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule { }