import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';

import { Species } from './species.model';
import { SizeService } from '../size/size.service';
import { UploadService } from '../upload.service';
import { trimObj } from '../utils';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectModel(Species)
    private readonly speciesModel: typeof Species,
    private uploadService: UploadService,
    @Inject(forwardRef(() => SizeService))
    private sizeService: SizeService,
  ) { }

  async get(query?: TFilterSpecies) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, {
      name: {
        [$.startsWith]: query.name.normalize().toLowerCase()
      }
    });

    return await this.speciesModel.findAll({
      paranoid: !query.inactives,
      where,
      attributes: ['id', 'name', 'sizes', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: boolean) {
    const species = await this.speciesModel.findByPk(id, { paranoid: !inactives });

    if (!species) throw new HttpException('Espécie não encontrada', 404);

    return species;
  }

  async findByName(name: string) {
    return await this.speciesModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });
  }

  async post(data: TCreateSpecies, media?: Express.MulterS3.File) {
    trimObj(data);

    try {
      if (data.name && await this.findByName(data.name)) throw new HttpException('Espécie já cadastrada', 400);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      const species = await this.speciesModel.create({ ...data });

      const sizes = await Promise.all(data.size.map(size => this.sizeService.post({ ...size, speciesId: species.id })));

      return { species, sizes };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateSpecies, media?: Express.MulterS3.File) {
    trimObj(data);

    try {
      const species = await this.findById(id);

      if (data.name && await this.findByName(data.name)) throw new HttpException('Espécie já cadastrada', 400);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      await species.update({ ...data });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async putSizes(id: number, sizeId: number, data: TUpdateSize) {
    trimObj(data);

    await this.findById(id);

    return await this.sizeService.put(id, sizeId, data);
  }

  async delete(id: number) {
    const species = await this.findById(id);

    await species.destroy();
  }

  async restore(id: number) {
    const species = await this.findById(id, true);

    await species.restore();
  }
}
