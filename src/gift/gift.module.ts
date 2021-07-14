import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { GiftController } from './gift.controller';
import { Gift } from './gift.model';
import { GiftService } from './gift.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Gift])
  ],
  controllers: [GiftController],
  providers: [GiftService],
  exports: [GiftService]
})
export class GiftModule { }