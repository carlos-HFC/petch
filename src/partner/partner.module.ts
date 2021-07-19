import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { PartnerController } from './partner.controller';
import { Partner } from './partner.model';
import { PartnerSeed } from './partner.seed';
import { PartnerService } from './partner.service';
import { UploadService } from '../upload.service';

@Module({
  imports: [
    SeederModule.forFeature([PartnerSeed]),
    SequelizeModule.forFeature([Partner]),
  ],
  controllers: [PartnerController],
  providers: [PartnerService, UploadService],
  exports: [PartnerService],
})
export class PartnerModule { }