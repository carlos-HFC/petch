import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SpeciesController } from './species.controller';
import { Species } from './species.model';
import { SpeciesSeed } from './species.seed';
import { SpeciesService } from './species.service';
import { UploadService } from '../upload.service';

@Module({
  imports: [
    SeederModule.forFeature([SpeciesSeed]),
    SequelizeModule.forFeature([Species])
  ],
  controllers: [SpeciesController],
  providers: [SpeciesService, UploadService],
  exports: [SpeciesService],
})
export class SpeciesModule { }
