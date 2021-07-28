import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';

import { Ong } from './ong.model';
import { trimObj, validateCEP, validateEmail, validatePhone } from '../utils';
import { UploadService } from 'src/upload.service';

@Injectable()
export class OngService {
  constructor(
    @InjectModel(Ong)
    private readonly ongModel: typeof Ong,
    private uploadService: UploadService
  ) { }

  async get(query?: TFilterOng) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, { name: { [$.startsWith]: query.name.normalize().toLowerCase() } });
    if (query.uf) Object.assign(where, { uf: query.uf.toUpperCase() });

    if (query.actingStates) {
      const ongs = await this.ongModel.findAll({
        paranoid: !query.inactives,
        where
      });

      const states = query.actingStates.toUpperCase().split(',').map(acting => acting.trim());

      const ongsFiltered = states.flatMap(state => ongs.filter(ong => ong.actingStates.includes(state)));

      return [...new Map(ongsFiltered.map(ong => [ong['id'], ong])).values()].sort((a, b) => a.id < b.id ? - 1 : 1);
    }

    return await this.ongModel.findAll({
      paranoid: !query.inactives,
      where
    });
  }

  async findById(id: number, inactives?: boolean) {
    const ong = await this.ongModel.findByPk(id, { paranoid: !inactives });

    if (!ong) throw new HttpException('ONG não encontrada', 404);

    return ong;
  }

  async findByName(name: string) {
    return await this.ongModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });
  }

  async findByEmail(email: string) {
    validateEmail(email);
    return await this.ongModel.findOne({
      where: {
        email: email.trim().toLowerCase()
      }
    });
  }

  async post(data: TCreateOng, media?: Express.MulterS3.File) {
    trimObj(data);
    validateCEP(data.cep);
    validatePhone(data.phone1);
    if (data.phone2) validatePhone(data.phone2);
    if (data.phone3) validatePhone(data.phone3);

    if (await this.findByEmail(data.email) || await this.findByName(data.name)) throw new HttpException('ONG já cadastrada', 400);

    const file = media && await this.uploadService.uploadFile(media);

    if (file) Object.assign(data, { logo: file.url });

    const ong = await this.ongModel.create({ ...data });

    return ong;
  }

  async put(id: number, data: TUpdateOng, media?: Express.MulterS3.File) {
    trimObj(data);
    if (data.cep) validateCEP(data.cep);
    if (data.phone1) validatePhone(data.phone1);
    if (data.phone2) validatePhone(data.phone2);
    if (data.phone3) validatePhone(data.phone3);

    const ong = await this.findById(id);

    if (data.email && data.email !== ong.email) {
      if (await this.findByEmail(data.email)) throw new HttpException('ONG já cadastrada', 400);
    }

    if (data.name && data.name !== ong.name) {
      if (await this.findByName(data.name)) throw new HttpException('ONG já cadastrada', 400);
    }

    const file = media && await this.uploadService.uploadFile(media);

    if (file) Object.assign(data, { logo: file.url });

    await ong.update({ ...data });
  }

  async delete(id: number) {
    const ong = await this.findById(id);

    await ong.destroy();
  }
}