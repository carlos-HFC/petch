import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SpeciesController } from './species.controller';
import { Species } from './species.model';
import { SpeciesSeed } from './species.seed';
import { SpeciesService } from './species.service';

@Module({
  imports: [
    SeederModule.forFeature([SpeciesSeed]),
    SequelizeModule.forFeature([Species])
  ],
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports: [SpeciesService],
})
export class SpeciesModule { }
