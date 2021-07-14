import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Gift } from './gift.model';

@Injectable()
export class GiftService {
  constructor(
    @InjectModel(Gift)
    private readonly giftModel: typeof Gift
  ) { }

  async get() {
    return await this.giftModel.findAll();
  }

  async getById(id: number) {
    const gift = await this.giftModel.findByPk(id);

    if (!gift) throw new HttpException('Brinde não encontrado', 404);

    return gift;
  }

  async post(data: object) { }
  async put(data: object) { }

  async delete(id: number) {
    const gift = await this.getById(id);

    await gift.destroy();
  }
}