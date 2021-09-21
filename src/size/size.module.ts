import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SizeController } from './size.controller';
import { Size } from './size.model';
import { SizeSeed } from './size.seed';
import { SizeService } from './size.service';
import { SpeciesModule } from '../species/species.module';

const imports = [
  SequelizeModule.forFeature([Size]),
  forwardRef(() => SpeciesModule),
];

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([SizeSeed]));
}

@Module({
  imports,
  controllers: [SizeController],
  providers: [SizeService],
  exports: [SizeService],
})
export class SizeModule { }