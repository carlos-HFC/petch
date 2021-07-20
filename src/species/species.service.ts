import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

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

  async post(name: string) {
    trimObj({ name });
    const exists = await this.getByName(name);

    if (exists) throw new HttpException('Espécie já cadastrada', 400);

    return await this.speciesModel.create({ name });
  }

  async put(id: number, name: string) {
    trimObj({ name });
    const specie = await this.getById(id);

    if (await this.getByName(name)) throw new HttpException('Espécie já cadastrada', 400);

    await specie.update({ name });
  }

  async delete(id: number) {
    const specie = await this.getById(id);

    await specie.destroy();
  }
}
