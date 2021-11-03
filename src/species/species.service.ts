import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateSpecies, TFilterSpecies, TUpdateSpecies } from './species.dto';
import { Species } from './species.model';
import { UploadService } from '../config/upload.service';
import { capitalizeFirstLetter, convertBool, trimObj } from '../utils';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectModel(Species)
    private readonly speciesModel: typeof Species,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async createSpecies() {
    const transaction = await this.sequelize.transaction();

    try {
      await Promise.all([
        this.speciesModel.upsert({
          id: 1,
          name: "Cachorro",
          image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }, { transaction }),
        this.speciesModel.upsert({
          id: 2,
          name: "Gato",
          image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }, { transaction })
      ]);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 404);
    }
  }

  async get(query?: TFilterSpecies) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, {
      name: {
        [$.startsWith]: query.name.normalize().toLowerCase()
      }
    });

    return await this.speciesModel.findAll({
      paranoid: !convertBool(query.inactives),
      where,
      attributes: ['id', 'name', 'image', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const species = await this.speciesModel.findByPk(id, { paranoid: !convertBool(inactives) });

    if (!species) throw new HttpException('Espécie não encontrada', 404);

    return species;
  }

  async findByName(name: string) {
    return await this.speciesModel.findOne({
      where: {
        name: capitalizeFirstLetter(name).trim()
      }
    });
  }

  async post(data: TCreateSpecies, media?: Express.MulterS3.File) {
    trimObj(data);

    if (await this.findByName(data.name)) throw new HttpException('Espécie já cadastrada', 400);

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    const transaction = await this.sequelize.transaction();

    try {
      await this.speciesModel.create({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'Espécie cadastrada com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateSpecies, media?: Express.MulterS3.File) {
    trimObj(data);
    const species = await this.findById(id);

    if (await this.findByName(data.name)) throw new HttpException('Espécie já cadastrada', 400);

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    const transaction = await this.sequelize.transaction();

    try {
      await species.update({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'Espécie editada com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const specie = await this.findById(id, 'true');

    if (!st) return await specie.destroy();
    return await specie.restore();
  }
}
