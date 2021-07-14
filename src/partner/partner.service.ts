import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Partner } from './partner.model';
import { MediaService } from '../medias/media.service';
import { trimObj, validateCEP, validateEmail, validatePhone } from '../utils';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner)
    private readonly partnerModel: typeof Partner,
    private mediaService: MediaService
  ) { }

  async get() {
    const partners = await this.partnerModel.findAll();

    return partners.map(partner => {
      return Object.assign(partner, { services: partner.services.split(',').map(el => el.trim()) });
    });
  }

  async getById(id: number) {
    const partner = await this.partnerModel.findByPk(id);

    if (!partner) throw new HttpException('ONG não encontrada', 404);

    return Object.assign(partner, { services: partner.services.split(',').map(el => el.trim()) });
  }

  async getByName(name: string) {
    return await this.partnerModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });
  }

  async getByEmail(email: string) {
    validateEmail(email);

    return await this.partnerModel.findOne({
      where: {
        email: email.normalize().trim().toLowerCase()
      }
    });
  }

  async post(data: TCreatePartner, media?: Express.MulterS3.File) {
    trimObj(data);
    validateCEP(data.cep);
    validatePhone(data.phone1);
    validatePhone(data?.phone2);
    validatePhone(data?.phone3);

    if (await this.getByEmail(data.email) || await this.getByName(data.name)) throw new HttpException('Parceiro já cadastrado', 400);

    const file = await this.mediaService.post(media);

    const partner = await this.partnerModel.create({ ...data, mediaId: file.id });

    return partner;
  }

  async put(data: TUpdatePartner) { }

  async delete(id: number) {
    const partner = await this.getById(id);

    await partner.destroy();
  }
}