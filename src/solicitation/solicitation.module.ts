import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { SolicitationTypesModule } from 'src/solicitationTypes/solicitationTypes.module';
import { UploadService } from 'src/upload.service';

import { SolicitationController } from './solicitation.controller';
import { Solicitation } from './solicitation.model';
import { SolicitationSeed } from './solicitation.seed';
import { SolicitationService } from './solicitation.service';

@Module({
  imports: [
    SeederModule.forFeature([SolicitationSeed]),
    SequelizeModule.forFeature([Solicitation]),
    SolicitationTypesModule
  ],
  controllers: [SolicitationController],
  providers: [SolicitationService, UploadService],
  exports: [SolicitationService],
})
export class SolicitationModule { }