import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SchedulingTypesController } from './schedulingTypes.controller';
import { SchedulingTypes } from './schedulingTypes.model';
import { SchedulingTypesSeed } from './schedulingTypes.seed';
import { SchedulingTypesService } from './schedulingTypes.service';

@Module({
  imports: [
    SeederModule.forFeature([SchedulingTypesSeed]),
    SequelizeModule.forFeature([SchedulingTypes])
  ],
  controllers: [SchedulingTypesController],
  providers: [SchedulingTypesService],
  exports: [SchedulingTypesService],
})
export class SchedulingTypesModule { }
