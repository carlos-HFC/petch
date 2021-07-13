import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MediaService } from 'src/medias/media.service';
import { trimObj, validateCEP } from 'src/utils';

import { Partner } from './partner.model';

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
    const partner = await this.partnerModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });

    return partner;
  }

  async post(data: TCreatePartner, media?: Express.MulterS3.File) {
    trimObj(data);
    validateCEP(data.cep);

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