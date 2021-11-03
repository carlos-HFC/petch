import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateGift, TFilterGift, TUpdateGift } from './gift.dto';
import { Gift } from './gift.model';
import { UploadService } from '../config/upload.service';
import { PartnerService } from '../partner/partner.service';
import { convertBool, trimObj } from '../utils';

@Injectable()
export class GiftService {
  constructor(
    @InjectModel(Gift)
    private readonly giftModel: typeof Gift,
    private partnerService: PartnerService,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async createGifts() {
    await this.giftModel.bulkCreate([
      {
        id: 1,
        partnerId: 1,
        name: 'Coleira',
        description: 'Coleira preta, simples de usar, que não machuca o seu pet',
        color: 'Preto',
        size: 'P',
        image: 'https://images.unsplash.com/photo-1620954492246-f1f107f4ec89?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGxlYXNofGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 2,
        partnerId: 3,
        name: 'Petisco',
        description: 'Um delicioso petisco para seu pet, excelente para fortalecer ossos',
        weight: '1kg',
        taste: 'churrasco',
        image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c25hY2slMjBkb2d8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 3,
        partnerId: 2,
        name: 'Cama',
        description: 'Uma caminha aconchegante para seu amigo',
        color: 'rosa',
        size: 'G',
        image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y291cG9ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
    ])
  }

  async get(query?: TFilterGift) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, { name: { [$.startsWith]: query.name.normalize().toLowerCase() } });

    return await this.giftModel.findAll({
      paranoid: !convertBool(query.inactives),
      where,
      attributes: ['id', 'name', 'description', 'image', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const gift = await this.giftModel.findByPk(id, { paranoid: !convertBool(inactives) });

    if (!gift) throw new HttpException('Brinde não encontrado', 404);

    return gift;
  }

  async post(data: TCreateGift, media?: Express.MulterS3.File) {
    trimObj(data);
    const num = (/([\d])/g);

    await this.partnerService.findById(data.partnerId);

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    if (data.weight) {
      const weight = Number(data.weight.match(num)?.join(''));
      if (isNaN(weight)) throw new HttpException('Peso inválido', 400);
    }

    const transaction = await this.sequelize.transaction();

    try {
      await this.giftModel.create({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'Brinde cadastrado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateGift, media?: Express.MulterS3.File) {
    trimObj(data);
    const num = (/([\d])/g);
    const gift = await this.findById(id);

    if (data.partnerId) await this.partnerService.findById(data.partnerId);

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    if (data.weight) {
      const weight = Number(data.weight.match(num)?.join(''));
      if (isNaN(weight)) throw new HttpException('Peso inválido', 400);
    }

    const transaction = await this.sequelize.transaction();

    try {
      await gift.update({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'Brinde editado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const gift = await this.findById(id, 'true');

    if (!st) return await gift.destroy();
    return await gift.restore();
  }
}