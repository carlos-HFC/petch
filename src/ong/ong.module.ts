import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { OngController } from './ong.controller';
import { Ong } from './ong.model';
import { OngService } from './ong.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Ong])
  ],
  controllers: [OngController],
  providers: [OngService],
  exports: [OngService],
})
export class OngModule { }