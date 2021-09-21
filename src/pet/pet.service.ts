import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, where } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Pet } from './pet.model';
import { OngService } from '../ong/ong.service';
import { SizeService } from '../size/size.service';
import { SpeciesService } from '../species/species.service';
import { trimObj } from '../utils';
import { UploadService } from '../upload.service';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet)
    private readonly petModel: typeof Pet,
    private ongService: OngService,
    private speciesService: SpeciesService,
    private sizeService: SizeService,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async get(query?: TFilterPet) {
    trimObj(query);

    const options = {};

    if (query.gender) Object.assign(options, { gender: query.gender });
    if (query.ong) Object.assign(options, { ong: where(col('ong.name'), query.ong.normalize()) });
    if (query.species) Object.assign(options, { species: where(col('species.name'), query.species.normalize()) });

    return await this.petModel.findAll({
      paranoid: !query.inactives,
      where: options,
    });
  }

  async findById(id: number, inactives?: boolean) {
    const pet = await this.petModel.findByPk(id, { paranoid: !inactives });

    if (!pet) throw new HttpException('Pet não encontrado', 404);

    return pet;
  }

  async post(data: TCreatePet, media: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      if (data.ongId) await this.ongService.findById(data.ongId);
      if (data.speciesId) await this.speciesService.findById(data.speciesId);

      if (!media) throw new HttpException('O Pet deve conter uma foto', 400);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url
        Object.assign(data,{image})
      }

      const pet = await this.petModel.create({ ...data }, { transaction });

      await transaction.commit();

      return pet;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdatePet) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      const pet = await this.findById(id);

      if (data.ongId) await this.ongService.findById(data.ongId);
      if (data.speciesId) await this.speciesService.findById(data.speciesId);

      await pet.update({ ...data }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async delete(id: number) {
    const pet = await this.findById(id);

    await pet.destroy();
  }

  async restore(id: number) {
    const pet = await this.findById(id, true);

    await pet.restore();
  }
}