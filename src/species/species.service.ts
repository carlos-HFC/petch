import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';

import { Species } from './species.model';
import { trimObj } from '../utils';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectModel(Species)
    private readonly speciesModel: typeof Species
  ) { }

  async get(name?: string) {
    if (name) return await this.getByName(name);

    return await this.speciesModel.findAll();
  }

  async getById(id: number) {
    const species = await this.speciesModel.findByPk(id);

    if (!species) throw new HttpException("Espécie não encontrada", 404);

    return species;
  }

  async getByName(name: string) {
    return await this.speciesModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });
  }

  async post(data: { name: string; }) {
    trimObj(data);
    const exists = await this.getByName(data.name);

    if (exists) throw new HttpException('Espécie já cadastrada', 400);

    return await this.speciesModel.create({ ...data });
  }
}
