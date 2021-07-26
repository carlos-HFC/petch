import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { GiftController } from './gift.controller';
import { Gift } from './gift.model';
import { GiftSeed } from './gift.seed';
import { GiftService } from './gift.service';
import { UploadService } from '../upload.service';
import { PartnerModule } from 'src/partner/partner.module';

@Module({
  imports: [
    SeederModule.forFeature([GiftSeed]),
    SequelizeModule.forFeature([Gift]),
    PartnerModule
  ],
  controllers: [GiftController],
  providers: [GiftService, UploadService],
  exports: [GiftService]
})
export class GiftModule { }