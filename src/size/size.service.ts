import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateSize, TUpdateSize } from './size.dto';
import { Size } from './size.model';
import { SpeciesService } from '../species/species.service';

@Injectable()
export class SizeService {
  constructor(
    @InjectModel(Size)
    private readonly sizeModel: typeof Size,
    @Inject(forwardRef(() => SpeciesService))
    private speciesService: SpeciesService,
    private sequelize: Sequelize
  ) { }

  async get() {
    return await this.sizeModel.findAll();
  }

  async findBySize(speciesId: number, size: number) {
    return await this.sizeModel.findOne({
      where: {
        speciesId,
        [$.and]: {
          initWeight: { [$.lte]: size },
          endWeight: { [$.gte]: size },
        }
      }
    });
  }

  async findById(id: number) {
    const size = await this.sizeModel.findByPk(id);

    if (!size) throw new HttpException('Porte não encontrado', 404);

    return size;
  }

  async post(speciesId: number, data: TCreateSize) {
    const transaction = await this.sequelize.transaction();

    const num = (/([\d]{0,})([\.{1}])?([\d]+)/g);

    try {
      await this.speciesService.findById(speciesId);

      const initWeight = Number(data.initWeight.match(num)?.join(''));
      const endWeight = Number(data.endWeight.match(num)?.join(''));

      if (isNaN(initWeight) || isNaN(endWeight)) throw new HttpException('Valor inválido', 400);

      if (initWeight >= endWeight) throw new HttpException('Peso inicial não pode ser maior ou igual ao peso final', 400);

      const size = await this.sizeModel.create({ ...data, speciesId }, { transaction });

      await transaction.commit();

      return size;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(speciesId: number, id: number, data: TUpdateSize) {
    const transaction = await this.sequelize.transaction();

    const num = (/([\d]{0,})([\.{1}])?([\d]+)/g);

    try {
      const size = await this.sizeModel.findOne({ where: { speciesId, id } });

      if (!size) throw new HttpException('Porte não encontrado', 404);

      if (data.name && data.name !== size.name) {
        const exists = await this.sizeModel.findOne({
          where: {
            speciesId,
            name: data.name.normalize().toLowerCase()
          }
        });

        if (exists) throw new HttpException('Porte já existente para essa espécie', 400);
      }

      const initWeight = Number((data.initWeight || size.initWeight).match(num).join(''));
      const endWeight = Number((data.endWeight || size.endWeight).match(num).join(''));

      if (isNaN(initWeight) || isNaN(endWeight)) throw new HttpException('Valor inválido', 400);

      if (initWeight >= endWeight) throw new HttpException('Peso Inicial não pode ser maior ou igual ao Peso Final', 400);

      await size.update({ ...data }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }
}