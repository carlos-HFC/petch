import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Gift } from './gift.model';
import { UploadService } from '../upload.service';
import { trimObj } from '../utils';

@Injectable()
export class GiftService {
  constructor(
    @InjectModel(Gift)
    private readonly giftModel: typeof Gift,
    private uploadService: UploadService
  ) { }

  async get() {
    return await this.giftModel.findAll();
  }

  async getById(id: number) {
    const gift = await this.giftModel.findByPk(id);

    if (!gift) throw new HttpException('Brinde não encontrado', 404);

    return gift;
  }

  async post(data: TCreateGift, media?: Express.MulterS3.File) {
    trimObj(data);

    const file = media ? await this.uploadService.uploadFile(media) : null;

    const gift = await this.giftModel.create({
      ...data,
      media: file && file.url
    });

    return gift;
  }

  async put(data: object) { }

  async delete(id: number) {
    const gift = await this.getById(id);

    await gift.destroy();
  }
}