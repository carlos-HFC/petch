import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Ong } from './ong.model';

@Injectable()
export class OngService {
  constructor(
    @InjectModel(Ong)
    private readonly ongModel: typeof Ong
  ) { }

  async get() {
    const ongs = await this.ongModel.findAll();

    return ongs.map(ong => {
      return Object.assign(ong, { actingStates: ong.actingStates.split(',').map(el => el.trim()) });
    });
  }

  async getById(id: number) {
    const ong = await this.ongModel.findByPk(id);

    if (!ong) throw new HttpException('ONG não encontrada', 404);

    return Object.assign(ong, { actingStates: ong.actingStates.split(',').map(el => el.trim()) });
  }

  async getByName(name: string) {
    const ong = await this.ongModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });

    return ong;
  }

  async post(data: TCreateOng) {
    return await this.ongModel.create({ ...data });
  }

  async put(data: TUpdateOng) { }

  async delete(id: number) {
    const ong = await this.getById(id);

    await ong.destroy();
  }
}