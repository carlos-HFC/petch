import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Gift } from './gift.model';
import { UploadService } from '../upload.service';
import { trimObj } from '../utils';
import { PartnerService } from 'src/partner/partner.service';

@Injectable()
export class GiftService {
  constructor(
    @InjectModel(Gift)
    private readonly giftModel: typeof Gift,
    private partnerService: PartnerService,
    private uploadService: UploadService
  ) { }

  async get(inactives?: boolean) {
    if (inactives) return await this.giftModel.findAll({ paranoid: false });
    return await this.giftModel.findAll();
  }

  async findById(id: number, inactives?: boolean) {
    const gift = await this.giftModel.findByPk(id, { paranoid: !inactives });

    if (!gift) throw new HttpException('Brinde não encontrado', 404);

    return gift;
  }

  async post(data: TCreateGift, media?: Express.MulterS3.File) {
    trimObj(data);

    await this.partnerService.findById(data.partnerId);

    const file = media && await this.uploadService.uploadFile(media);

    if (file) Object.assign(data, { media: file.url });

    const gift = await this.giftModel.create({ ...data });

    return gift;
  }

  async put(id: number, data: TUpdateGift, media?: Express.MulterS3.File) {
    trimObj(data);

    const gift = await this.findById(id);

    if (data.partnerId) await this.partnerService.findById(data.partnerId);

    const file = media && await this.uploadService.uploadFile(media);

    if (file) Object.assign(data, { media: file.url });

    await gift.update({ ...data });
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