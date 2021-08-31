import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SchedulingController } from './scheduling.controller';
import { Scheduling } from './scheduling.model';
import { SchedulingService } from './scheduling.service';
import { SchedulingTypesModule } from '../schedulingTypes/schedulingTypes.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Scheduling]),
    SchedulingTypesModule,
    UserModule,
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule { }