import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { OngController } from './ong.controller';
import { Ong } from './ong.model';
import { OngSeed } from './ong.seed';
import { OngService } from './ong.service';
import { UploadService } from '../upload.service';

@Module({
  imports: [
    // SeederModule.forFeature([OngSeed]),
    SequelizeModule.forFeature([Ong])
  ],
  controllers: [OngController],
  providers: [OngService, UploadService],
  exports: [OngService],
})
export class OngModule { }