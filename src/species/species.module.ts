import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SpeciesController } from './species.controller';
import { Species } from './species.model';
import { SpeciesSeed } from './species.seed';
import { SpeciesService } from './species.service';
import { UploadService } from '../config/upload.service';
import { SizeModule } from '../size/size.module';

const imports = [
  SequelizeModule.forFeature([Species]),
  forwardRef(() => SizeModule),
]

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([SpeciesSeed]));
}

@Module({
  imports,
  controllers: [SpeciesController],
  providers: [SpeciesService, UploadService],
  exports: [SpeciesService],
})
export class SpeciesModule { }
