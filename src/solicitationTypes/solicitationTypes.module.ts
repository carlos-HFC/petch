import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SolicitationTypesController } from './solicitationTypes.controller';
import { SolicitationTypes } from './solicitationTypes.model';
import { SolicitationTypesSeed } from './solicitationTypes.seed';
import { SolicitationTypesService } from './solicitationTypes.service';

@Module({
  imports: [
    SeederModule.forFeature([SolicitationTypesSeed]),
    SequelizeModule.forFeature([SolicitationTypes])
  ],
  controllers: [SolicitationTypesController],
  providers: [SolicitationTypesService],
  exports: [SolicitationTypesService],
})
export class SolicitationTypesModule { }
