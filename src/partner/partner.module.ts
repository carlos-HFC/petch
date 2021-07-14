import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { PartnerController } from './partner.controller';
import { Partner } from './partner.model';
import { PartnerSeed } from './partner.seed';
import { PartnerService } from './partner.service';
import { MediaModule } from '../medias/media.module';

@Module({
  imports: [
    SeederModule.forFeature([PartnerSeed]),
    SequelizeModule.forFeature([Partner]),
    MediaModule
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule { }