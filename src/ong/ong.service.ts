import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Ong } from './ong.model';
import { trimObj, validateCEP, validateEmail, validatePhone } from '../utils';

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
    return await this.ongModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });
  }

  async getByEmail(email: string) {
    validateEmail(email);
    return await this.ongModel.findOne({
      where: {
        email: email.normalize().trim().toLowerCase()
      }
    });
  }

  async post(data: TCreateOng) {
    trimObj(data);
    validateCEP(data.cep);
    validatePhone(data.phone1);
    validatePhone(data?.phone2);
    validatePhone(data?.phone3);

    if (await this.getByEmail(data.email) || await this.getByName(data.name)) throw new HttpException('ONG já cadastrada', 400);

    const ong = await this.ongModel.create({ ...data });

    return ong;
  }

  async put(data: TUpdateOng) { }

  async delete(id: number) {
    const ong = await this.getById(id);

    await ong.destroy();
  }
}