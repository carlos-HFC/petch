import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PetController } from './pet.controller';
import { Pet } from './pet.model';
import { PetService } from './pet.service';
import { OngModule } from '../ong/ong.module';
import { SizeModule } from '../size/size.module';
import { SpeciesModule } from '../species/species.module';
import { UploadService } from '../upload.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Pet]),
    OngModule,
    SpeciesModule,
    SizeModule
  ],
  controllers: [PetController],
  providers: [PetService, UploadService],
  exports: [PetService],
})
export class PetModule { }