import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';

import { Gift } from './gift.model';
import { PartnerService } from '../partner/partner.service';
import { UploadService } from '../upload.service';
import { trimObj } from '../utils';

@Injectable()
export class GiftService {
  constructor(
    @InjectModel(Gift)
    private readonly giftModel: typeof Gift,
    private partnerService: PartnerService,
    private uploadService: UploadService
  ) { }

  async get(query?: TFilterGift) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, {
      name: {
        [$.startsWith]: query.name.normalize().toLowerCase()
      }
    });

    return await this.giftModel.findAll({
      paranoid: !query.inactives,
      where
    });
  }

  async findById(id: number, inactives?: boolean) {
    const gift = await this.giftModel.findByPk(id, { paranoid: !inactives });

    if (!gift) throw new HttpException('Brinde não encontrado', 404);

    return gift;
  }

  async post(data: TCreateGift, media?: Express.MulterS3.File) {
    trimObj(data);

    try {
      if (data.partnerId) await this.partnerService.findById(data.partnerId);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      const gift = await this.giftModel.create({ ...data });

      return gift;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateGift, media?: Express.MulterS3.File) {
    trimObj(data);

    try {
      const gift = await this.findById(id);

      if (data.partnerId) await this.partnerService.findById(data.partnerId);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      await gift.update({ ...data });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async delete(id: number) {
    const gift = await this.findById(id);

    await gift.destroy();
  }

  async restore(id: number) {
    const gift = await this.findById(id, true);

    await gift.restore();
  }
}